import { useDeferredValue, useEffect, useRef, useState } from "react";
import cl from "../styles/components/Autocomplete.module.css";
import List, { ListRef } from "./UI/List";
import { GroupBase, OptionType } from "../types/AutocompleteTypes";
import Input, { InputRef } from "./UI/Input";
import GroupedList from "./UI/GroupedList";

interface AutocompleteProps {
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: OptionType;
  required?: boolean;
  checkbox?: boolean;
  options?: OptionType[] | GroupBase<OptionType>[];
  label?: string;
  grouped?: boolean;
  noOptionsMessage?: string;
  onChange?: (event: OptionType | null) => void;
  onChangeInput?: (event: string) => void;
  groupClassName?: string;
}

const Autocomplete = ({
  disabled = false,
  isLoading = false,
  required,
  checkbox = false,
  options,
  grouped = false,
  label = "",
  noOptionsMessage = "Нет элементов",
  groupClassName,
  defaultValue,
  onChange,
  onChangeInput,
}: AutocompleteProps) => {
  const inputRef = useRef<InputRef>(null);
  const optionsRef = useRef<ListRef>(null);
  const [isFilteredList, setIsFilteredList] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<OptionType[]>(options || []);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    defaultValue || null,
  );
  const deferredFilteredList = useDeferredValue(filteredList);

  useEffect(() => {
    if (options !== filteredList) setFilteredList(options || []);
  }, [options]);

  return (
    <div className={cl.container}>
      <Input
        disabled={disabled}
        isLoading={isLoading}
        defaultValue={defaultValue}
        required={required}
        ref={inputRef}
        onChange={onChange}
        isDefOptions={deferredFilteredList !== filteredList}
        onChangeInput={onChangeInput}
        setFilteredList={setFilteredList}
        filteredList={deferredFilteredList}
        isFilteredList={isFilteredList}
        setIsFilteredList={setIsFilteredList}
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        label={label}
        options={options || []}
        optionsRef={optionsRef}
      />
      {grouped ? (
        <GroupedList
          checkbox={checkbox}
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
        <List
          checkbox={checkbox}
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
  );
};

export default Autocomplete;
