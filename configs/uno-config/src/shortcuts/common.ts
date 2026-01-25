import { ConfigBase } from 'unocss';

// eslint-disable-next-line react-func/max-lines-per-function
export const getCommonShortcuts = (): ConfigBase['shortcuts'] => {
  return [
    [
      new RegExp('border-primary'),
      ([, type, unit]) => {
        return `border border-color-primary`;
      },
      {
        autocomplete: 'border-primary',
      },
    ],
    [
      new RegExp('absolute-center'),
      ([, type, unit]) => {
        return `absolute top-50% left-50% -translate-x-50% -translate-y-50%`;
      },
      {
        autocomplete: 'absolute-center',
      },
    ],
    [
      new RegExp('absolute-content'),
      ([, type, unit]) => {
        return `absolute top-0 bottom-0 left-0 right-0`;
      },
      {
        autocomplete: 'absolute-content',
      },
    ],
    [
      new RegExp('background-common-cover'),
      ([, type, unit]) => {
        return `bg-no-repeat bg-center bg-cover`;
      },
      {
        autocomplete: 'background-common-cover',
      },
    ],
    [
      new RegExp('background-common-contain'),
      ([, type, unit]) => {
        return `bg-no-repeat bg-center bg-contain`;
      },
      {
        autocomplete: 'background-common-contain',
      },
    ],
    [
      new RegExp('truncate-1'),
      ([, type, unit]) => {
        return `truncate line-camp-1`;
      },
      {
        autocomplete: 'truncate-1',
      },
    ],
    [
      new RegExp('truncate-2'),
      ([, type, unit]) => {
        return `truncate line-camp-2`;
      },
      {
        autocomplete: 'truncate-2',
      },
    ],
    [
      new RegExp('truncate-3'),
      ([, type, unit]) => {
        return `truncate line-camp-3`;
      },
      {
        autocomplete: 'truncate-3',
      },
    ],
    [
      new RegExp('truncate-4'),
      ([, type, unit]) => {
        return `truncate line-camp-4`;
      },
      {
        autocomplete: 'truncate-4',
      },
    ],
    [
      new RegExp('truncate-5'),
      ([, type, unit]) => {
        return `truncate line-camp-5`;
      },
      {
        autocomplete: 'truncate-5',
      },
    ],
  ];
};
