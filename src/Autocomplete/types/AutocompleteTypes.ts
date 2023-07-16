export type OptionType = {
  label: string;
  isDisabled?: boolean;
  [key: string]: any;
};

export type GroupBase<Type> = {
  label: string;
  options: Type[];
};
