import { useDeferredValue, useRef, useState } from "react";
import cl from "../styles/components/Autocomplete.module.css";
import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import Input, { InputRef } from "./UI/Input";
import VirtualList, { VirtualListRef } from "./UI/VirtualList";

interface GroupBase<OptionType> {
  label: string;
  options: OptionType[];
}

interface AutocompleteProps {
  options: OptionType[];
  label?: string;
  noOptionsMessage?: string;
  optionHi?: number;
  onChange?: (event: OptionType | null) => void;
  onChangeInput?: (event: string) => void;
}

const VirtualAutocomplete: React.FC<AutocompleteProps> = ({
  optionHi = 30,
  options,
  label = "",
  noOptionsMessage = "Нет элементов",
  onChange,
  onChangeInput,
}) => {
  const inputRef = useRef<InputRef>(null);
  const optionsRef = useRef<VirtualListRef>(null);
  const [isFilteredList, setIsFilteredList] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<OptionType[]>(options);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const deferredFilteredList = useDeferredValue(filteredList);

  return (
    <div>
      <div className={cl.container}>
        <Input
          ref={inputRef}
          onChange={onChange}
          onChangeInput={onChangeInput}
          setFilteredList={setFilteredList}
          filteredList={deferredFilteredList}
          isFilteredList={isFilteredList}
          setIsFilteredList={setIsFilteredList}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          label={label}
          options={options}
          optionsRef={optionsRef}
        />
        <VirtualList
          optionHi={optionHi}
          ref={optionsRef}
          isDefOptions={deferredFilteredList !== filteredList}
          options={deferredFilteredList}
          selectedOption={selectedOption}
          visible={isFilteredList}
          noOptionMessage={noOptionsMessage}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default VirtualAutocomplete;
