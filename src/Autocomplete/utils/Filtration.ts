import { GroupBase, OptionType } from "Autocomplete/types/AutocompleteTypes";

export class Filtration {
  static byString(
    options: OptionType[] | GroupBase<OptionType>[],
    filterString: string,
  ): OptionType[] | GroupBase<OptionType>[] {
    const newArr = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].hasOwnProperty("options")) {
        newArr.push({
          options: this.byString(options[i].options, filterString),
          label: options[i].label,
        });
      } else if (options[i].label.includes(filterString)) {
        newArr.push(options[i]);
      }
    }
    return newArr;
  }

  static byDisabled(
    options: OptionType[] | GroupBase<OptionType>[],
  ): OptionType[] | GroupBase<OptionType>[] {
    const newArr = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].hasOwnProperty("options")) {
        newArr.push({
          options: this.byDisabled(options[i].options),
          label: options[i].label,
        });
      } else if (!(options[i] as OptionType).isDisabled) {
        newArr.push(options[i]);
      }
    }
    return newArr;
  }
}
