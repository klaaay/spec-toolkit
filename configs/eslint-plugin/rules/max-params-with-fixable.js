'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '函数参数超过一定数量（默认 3）建议使用 object 来传参。',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        oneOf: [
          {
            type: 'integer',
            minimum: 0,
          },
          {
            type: 'object',
            properties: {
              maximum: {
                type: 'integer',
                minimum: 0,
              },
              max: {
                type: 'integer',
                minimum: 0,
              },
              autoFix: {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    fixable: 'code',
    messages: {
      shouldBeObject: '函数参数超过{{max}}个建议使用object来传参。',
    },
  },
  // eslint-disable-next-line react-func/max-lines-per-function
  create: function (context) {
    const option = context.options[0];
    // 允许的最大参数个数
    let ALLOW_MAX_NUM = 3;
    let WITH_AUTO_FIX = true;

    if (typeof option === 'object' && (Object.hasOwn(option, 'maximum') || Object.hasOwn(option, 'max'))) {
      ALLOW_MAX_NUM = option.maximum || option.max;
      WITH_AUTO_FIX = option.autoFix === undefined ? true : !!option.autoFix;
    }
    if (typeof option === 'number') {
      ALLOW_MAX_NUM = option;
    }

    function checkFunction(node) {
      if (node.params.length > ALLOW_MAX_NUM) {
        let isError = false,
          replaceLocation,
          variables;

        try {
          replaceLocation = [node.params[0].range[0], node.params.slice(-1)[0].range[1]];
          variables = node.params.reduce((accur, item) => {
            switch (item.type) {
              case 'ObjectPattern':
                item.properties.forEach(item2 => accur.push(...getPropertiesValueFromObjectPattern(item2)));
                break;
              case 'Identifier':
                accur.push(item.name);
                break;
              case 'ArrayPattern':
                item.elements.forEach(item2 => accur.push(...getPropertiesValueFromObjectPattern(item2)));
                break;
            }
            return accur;
          }, []);
        } catch {
          isError = true;
        }

        context.report({
          node,
          messageId: 'shouldBeObject',
          data: {
            max: ALLOW_MAX_NUM,
          },
          fix(fixer) {
            return isError || !WITH_AUTO_FIX
              ? null
              : fixer.replaceTextRange(replaceLocation, `{${variables.join(', ')}}`);
          },
        });
      }
    }

    return {
      FunctionDeclaration: checkFunction,
      ArrowFunctionExpression: checkFunction,
      FunctionExpression: checkFunction,
    };
  },
};

// 从对象中获取参数名
function getPropertiesValueFromObjectPattern(obj, collectionValues = []) {
  switch (obj?.value?.type || obj?.type) {
    case 'Identifier':
      collectionValues.push(obj.value?.name || obj.name);
      return collectionValues;
    case 'ObjectPattern':
      (obj?.value?.properties || obj?.properties).forEach(item =>
        collectionValues.push(...(getPropertiesValueFromObjectPattern(item) || [])),
      );
      return collectionValues;
    case 'ArrayPattern':
      obj.value.elements.forEach(item => collectionValues.push(...(getPropertiesValueFromObjectPattern(item) || [])));
      return collectionValues;
  }
}
