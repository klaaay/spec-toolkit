import { Rule } from 'unocss';

export const createUnoCssRules: (types: object, units: object) => Rule = (types, units) => {
  const typeUnion = Object.keys(types).join('|');
  const unitUnion = Object.keys(units).join('|');
  const regexp = new RegExp(`^(${typeUnion})-(${unitUnion})$`);
  return [
    regexp,
    ([, type, unit]) => {
      const cssType = types[type];
      if (Array.isArray(cssType)) {
        const outCss = {};
        cssType.forEach(item => {
          outCss[item] = units[unit];
        });
        return outCss;
      } else {
        return { [cssType]: `${units[unit]}` };
      }
    },
    { autocomplete: `(${typeUnion})-(${unitUnion})` },
  ];
};
