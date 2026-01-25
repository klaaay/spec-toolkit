const path = require('path');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '不建议使用 export default（除了页面懒加载需要）',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    let hasJSX = false;
    return {
      Program: function () {
        hasJSX = false; // 在开始检查新文件时重置
      },
      JSXElement: function (node) {
        hasJSX = true;
      },
      ExportDefaultDeclaration: function (node) {
        if (!hasJSX) {
          return context.report({
            node,
            message: '不建议使用 export default（除了页面懒加载需要）',
          });
        } else {
          const filename = context.getFilename();
          const directoryPath = path.dirname(filename);

          const allowedFolders = ['pages', 'page', 'layout', 'layouts'];
          const isAllowedFolder = allowedFolders.some(folder => directoryPath.includes(folder));

          const disallowedFolders = ['components', 'component'];
          const isDisallowedFolder = disallowedFolders.some(folder => directoryPath.includes(folder));

          if (!isAllowedFolder || isDisallowedFolder) {
            context.report({
              node,
              message: '不建议使用 export default（除了页面懒加载需要）',
            });
          }
        }
      },
    };
  },
};
