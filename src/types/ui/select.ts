
//select用の型
//Enumにも対応
export type SelectOption <T extends string = string> = {
  label: string;
  value: T;
};
