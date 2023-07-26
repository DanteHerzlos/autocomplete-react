import { useDeferredValue, useRef, useState } from "react";
import cl from "../styles/components/Autocomplete.module.css";
import { OptionType, GroupBase } from "Autocomplete/types/AutocompleteTypes";
import Input, { InputRef } from "./UI/Input";
import VirtualList, { VirtualListRef } from "./UI/VirtualList";
import GroupedVirtualList from "./UI/GroupedVirtualList";

interface AutocompleteProps {
  isLoading?: boolean;
  disabled?: boolean;
  defaultValue?: OptionType;
  required?: boolean;
  checkbox?: boolean;
  options: OptionType[] | GroupBase<OptionType>[];
  label?: string;
  noOptionsMessage?: string;
  optionHi?: number;
  grouped?: boolean;
  groupClassName?: string;
  onChange?: (event: OptionType | null) => void;
  onChangeInput?: (event: string) => void;
}

const VirtualAutocomplete = ({
  isLoading = false,
  disabled = false,
  defaultValue,
  required,
  checkbox = false,
  optionHi = 30,
  options,
  label = "",
  noOptionsMessage = "Нет элементов",
  groupClassName,
  grouped = false,
  onChange,
  onChangeInput,
}: AutocompleteProps) => {
  const inputRef = useRef<InputRef>(null);
  const optionsRef = useRef<VirtualListRef>(null);
  const [isFilteredList, setIsFilteredList] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<OptionType[]>(options);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    defaultValue || null,
  );
  const deferredFilteredList = useDeferredValue(filteredList);

  return (
    <div>
      <div className={cl.container}>
        <Input
          disabled={disabled}
          isLoading={isLoading}
          defaultValue={defaultValue}
          required={required}
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
        {grouped ? (
          <GroupedVirtualList
            checkbox={checkbox}
            optionHi={optionHi}
            ref={optionsRef}
            groupClassName={groupClassName || ""}
            isDefOptions={deferredFilteredList !== filteredList}
            groupedOptions={deferredFilteredList as GroupBase<OptionType>[]}
            selectedOption={selectedOption}
            visible={isFilteredList && !isLoading}
            noOptionMessage={noOptionsMessage}
            inputRef={inputRef}
          />
        ) : (
          <VirtualList
            checkbox={checkbox}
            optionHi={optionHi}
            ref={optionsRef}
            isDefOptions={deferredFilteredList !== filteredList}
            options={deferredFilteredList}
            selectedOption={selectedOption}
            visible={isFilteredList && !isLoading}
            noOptionMessage={noOptionsMessage}
            inputRef={inputRef}
          />
        )}
      </div>
    </div>
  );
};

export default VirtualAutocomplete;
