import { GroupBase, OptionType } from "../types/AutocompleteTypes";

export class Filtration {
  static byString(
    options: OptionType[] | GroupBase<OptionType>[],
    filterString: string,
  ): OptionType[] | GroupBase<OptionType>[] {
    const newArr = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].hasOwnProperty("options")) {
        const optionsOfGroup = this.byString(options[i].options, filterString);
        if (optionsOfGroup.length !== 0) {
          newArr.push({
            options: optionsOfGroup,
            label: options[i].label,
          });
        }
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
