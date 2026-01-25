/* eslint-disable react-func/max-lines-per-function */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'useEffect 建议紧接着 JSX return',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    const isValidReturnArgument = argument => {
      if (!argument) return false;
      if (argument.type === 'JSXElement' || argument.type === 'JSXFragment') {
        return true;
      }
      return argument.type === 'Literal' && argument.value === null;
    };

    const isValidReturnStatement = statement =>
      statement?.type === 'ReturnStatement' && isValidReturnArgument(statement.argument);

    return {
      ArrowFunctionExpression: function (node) {
        if (!Array.isArray(node?.body?.body)) {
          return;
        }
        const useEffectIndexes = [];
        const statementNodes = [];

        const JSXReturnIndex = node.body.body.findIndex(n => {
          // 检查直接返回 JSX
          if (isValidReturnStatement(n)) {
            return true;
          }
          // 检查 if 语句中返回 JSX
          if (n?.type === 'IfStatement') {
            if (isValidReturnStatement(n.consequent)) {
              return true;
            }
            if (
              n.consequent?.type === 'BlockStatement' &&
              n.consequent.body[0]?.type === 'ReturnStatement' &&
              isValidReturnArgument(n.consequent.body[0].argument)
            ) {
              return true;
            }
          }
          return false;
        });

        if (JSXReturnIndex === -1) {
          return;
        }

        node.body.body.forEach((n, index) => {
          const isUseEffect =
            n?.type === 'ExpressionStatement' && n.expression.callee && n.expression.callee.name === 'useEffect';

          if (index < JSXReturnIndex) {
            statementNodes.push(n);
            if (isUseEffect) useEffectIndexes.push(index);
          }
        });

        useEffectIndexes.forEach((useEffectIndex, i) => {
          const nextStatementIndex = i < useEffectIndexes.length - 1 ? useEffectIndexes[i + 1] : JSXReturnIndex;
          if (nextStatementIndex - useEffectIndex > 1) {
            context.report({
              node: statementNodes[useEffectIndex],
              message: 'useEffect 建议紧接在 JSX return',
            });
          }
        });
      },
    };
  },
};
