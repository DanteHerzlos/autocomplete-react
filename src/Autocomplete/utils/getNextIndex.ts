import { OptionType } from "Autocomplete/types/AutocompleteTypes";

export const getNextOptionIndex = (options: OptionType[], cursor: number) => {
  if(cursor < 0) throw new Error('Cursor out of range!')
  let nextIndex = options.slice(cursor + 1).findIndex((el) => !el.isDisabled);
  if (nextIndex === -1) {
    return options.slice(0, cursor + 1).findIndex((el) => !el.isDisabled);
  }
  return nextIndex + cursor + 1;
};

export const getPrevOptionIndex = (options: OptionType[], cursor: number) => {
  if(cursor < 0) throw new Error('Cursor out of range!')
  let prevIndex = options
    .slice(0, cursor)
    .findLastIndex((el) => !el.isDisabled);
  if (prevIndex === -1) {
    return options.slice(cursor).findLastIndex((el) => !el.isDisabled) + cursor;
  }
  return prevIndex;
};
