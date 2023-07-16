import { OptionType, GroupBase } from "Autocomplete/types/AutocompleteTypes";

export const getNextOptionIndex = (
  groupedOptions: GroupBase<OptionType>[],
  cursor: number[],
): number[] | -1 => {
  if (cursor[0] < 0 || cursor[1] < 0) throw new Error("Cursor out of range!");
  for (let i = cursor[0]; i < groupedOptions.length; i++) {
    const options = groupedOptions[i].options;
    const start = i === cursor[0] ? cursor[1] + 1 : 0;
    for (let j = start; j < options.length; j++) {
      if (!options[j].isDisabled) {
        return [i, j];
      }
    }
  }
  for (let i = 0; i < cursor[0] + 1; i++) {
    const options = groupedOptions[i].options;
    const end = i === cursor[0] ? cursor[1] : options.length;
    for (let j = 0; j < end; j++) {
      if (!options[j].isDisabled) {
        return [i, j];
      }
    }
  }
  return -1;
};

export const getPrevOptionIndex = (
  groupedOptions: GroupBase<OptionType>[],
  cursor: number[],
): number[] | -1 => {
  if (cursor[0] < 0 || cursor[1] < 0) throw new Error("Cursor out of range!");

  for (let i = cursor[0]; i >= 0; i--) {
    const options = groupedOptions[i].options;
    const start = i === cursor[0] ? cursor[1] - 1 : options.length - 1;
    for (let j = start; j >= 0; j--) {
      if (!options[j].isDisabled) {
        return [i, j];
      }
    }
  }

  for (let i = groupedOptions.length - 1; i >= cursor[0]; i--) {
    const options = groupedOptions[i].options;
    const end = i === cursor[0] ? cursor[1] : 0;
    for (let j = options.length - 1; j >= end; j--) {
      if (!options[j].isDisabled) {
        return [i, j];
      }
    }
  }
  return -1;
};

export const getfirstEnabled = (
  groupedOptions: GroupBase<OptionType>[],
): number[] | -1 => {
  for (let i = 0; i < groupedOptions.length; i++) {
    const options = groupedOptions[i].options;
    for (let j = 0; j < options.length; j++) {
      if (!options[j].isDisabled) {
        return [i, j];
      }
    }
  }
  return -1;
};
