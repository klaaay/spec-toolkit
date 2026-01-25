/* eslint-disable react-func/max-lines-per-function */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '在原子类中使用预设的间距规范而不是使用具体的绝对距离',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: 'code', // 或 null，如果规则不支持自动修复
    schema: [
      {
        type: 'object',
        properties: {
          styleMappings: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ], // 如果你的规则需要选项，则定义这里的 JSON schema
  },
  create: function (context) {
    const options = context?.options?.[0] || {};
    const styleMappings = options?.styleMappings || {
      '48px': 'xxl',
      '32px': 'xl',
      '24px': 'lg',
      '20px': 'md',
      '16px': 'base',
      '12px': 'sm',
      '8px': 'xs',
      '4px': 'xxs',
    };

    const properties = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'g'];

    function checkClassName(node, className) {
      properties.forEach(prop => {
        const regex = new RegExp(`^(${prop}(?:-[a-z])?-?)\\[?([0-9]+px)\\]?$`);
        const match = className.match(regex);
        if (match && match[2] && styleMappings[match[2]]) {
          const newClassName = `${match[1].replace(/\-/g, '')}-${styleMappings[match[2]]}`;
          context.report({
            node,
            message: `使用 "${newClassName}" 替代 "${className}"`,
            fix(fixer) {
              let originalValue = '';
              if (!node.value) return;
              if (node.value.type === 'Literal') {
                originalValue = node.value.raw;
              } else if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'Literal') {
                originalValue = node.value.expression.raw;
              } else {
                return null; // 非文本节点，无法直接替换
              }

              const newValue = originalValue.replace(new RegExp(`${className}`, 'g'), newClassName);
              if (originalValue && newValue) {
                return fixer.replaceText(node.value, newValue);
              }
              return null; // 未修改或不可处理的情况，不进行修复
            },
          });
        }
      });
    }

    function getLiteralValue(node) {
      if (node.type === 'Literal' || node.type === 'JSXText') {
        return node.value;
      } else if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
        return node.quasis[0].value.raw;
      }
      return null;
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') {
          return;
        }

        // 确保 node.value 存在
        if (!node.value) {
          return;
        }

        if (node.value.type === 'Literal') {
          node.value.value.split(' ').forEach(className => checkClassName(node.value, className));
        } else if (node.value.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;
          if (expr.type === 'CallExpression' && expr.callee.name === 'cx') {
            expr.arguments.forEach(arg => {
              const value = getLiteralValue(arg);
              if (value) {
                value.split(' ').forEach(className => checkClassName(node.value, className));
              }
            });
          }
        }
      },
    };
  },
};
