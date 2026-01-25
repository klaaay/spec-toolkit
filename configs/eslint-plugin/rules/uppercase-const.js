module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '顶层作用域（非其他变量引用、函数）不可变常量使用大写字母命名',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },

  create: function (context) {
    return {
      VariableDeclaration(node) {
        if (
          (node.parent?.type === 'Program' && node.kind === 'const') ||
          (node.parent?.type === 'ExportNamedDeclaration' && node.kind === 'const')
        ) {
          node.declarations.forEach(declaration => {
            if (declaration.init) {
              if (
                (declaration.init?.type === 'Literal' &&
                  (typeof declaration.init.value === 'number' || typeof declaration.init.value === 'string')) ||
                (declaration.init?.type === 'ArrayExpression' && shouldReportArray(declaration.init.elements)) ||
                (declaration.init?.type === 'ObjectExpression' && shouldReportObject(declaration.init.properties))
              ) {
                if (!/^[A-Z0-9_]+$/.test(declaration.id.name)) {
                  context.report({
                    node: declaration.id,
                    message: '顶层作用域（非其他变量引用、函数）不可变常量使用大写字母命名',
                  });
                }
              }
            }
          });
        }
      },
    };
  },
};

function shouldReportArray(elements) {
  if (elements.length === 0) {
    return true;
  }
  return elements.some(element => {
    if (element?.type === 'Literal' && (typeof element.value === 'number' || typeof element.value === 'string')) {
      return true;
    }
    if (element?.type === 'ObjectExpression') {
      return shouldReportObject(element.properties);
    }
    return false;
  });
}

function shouldReportObject(properties) {
  return properties.every(property => {
    if (
      property.value?.type === 'Literal' &&
      (typeof property.value.value === 'number' || typeof property.value.value === 'string')
    ) {
      return true;
    }
    if (property.value?.type === 'ObjectExpression') {
      return shouldReportObject(property.value.properties);
    }
    return false;
  });
}
