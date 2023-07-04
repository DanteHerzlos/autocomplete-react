export type OptionType = {
  label: string;
  isDisabled?: boolean;
  [key: string]: any;
};

export type GroupType = {
  label: string;
  options: OptionType[];
};
