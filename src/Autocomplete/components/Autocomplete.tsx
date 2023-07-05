import { useRef, useState } from "react";
import cl from "../styles/components/Autocomplete.module.css";
import List, { ListRef } from "./UI/List";
import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import Input, { InputRef } from "./UI/Input";

interface AutocompleteProps {
  options: OptionType[];
  label?: string;
  noOptionsMessage?: string;
  onChange?: (event: OptionType | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  label = "",
  noOptionsMessage = "Нет элементов",
  onChange,
}) => {
  const inputRef = useRef<InputRef>(null)
  const optionsRef = useRef<ListRef>(null);
  const [isFilteredList, setIsFilteredList] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<OptionType[]>(options);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  return (
    <div>
      <div className={cl.container}>
        <Input
          ref={inputRef}
          onChange={onChange}
          setFilteredList={setFilteredList}
          filteredList={filteredList}
          isFilteredList={isFilteredList}
          setIsFilteredList={setIsFilteredList}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          label={label}
          options={options}
          optionsRef={optionsRef}
        />
        <List
          ref={optionsRef}
          options={filteredList}
          selectedOption={selectedOption}
          visible={isFilteredList}
          noOptionMessage={noOptionsMessage}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default Autocomplete;
