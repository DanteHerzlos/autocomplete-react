import { OptionType } from "Autocomplete/types/AutocompleteTypes";

export class Filtration {
  static byString(options: OptionType[], filterString: string) {
    const newArr = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].label.includes(filterString)) {
        newArr.push(options[i]);
      }
    }
    return newArr;
  }

  static byDisabled(options: OptionType[]) {
    const newArr = [];
    for (let i = 0; i < options.length; i++) {
      if (!options[i].isDisabled) {
        newArr.push(options[i]);
      }
    }
    return newArr;
  }
}
