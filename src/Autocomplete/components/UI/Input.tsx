import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import { forwardRef, useImperativeHandle, useRef } from "react";
import IconButton from "./IconButton";
import CloseIcon from "../icons/CloseIcon";
import ArrowDropDownIcon from "../icons/ArrowDropDownIcon";
import cl from "../../styles/components/UI/Input.module.css";
import { ListRef } from "./List";

interface InputProps {
  onChange?: (event: OptionType | null) => void;
  setSelectedOption: (option: OptionType | null) => void;
  setIsFilteredList: (visible: boolean) => void;
  isFilteredList: boolean;
  filteredList: OptionType[];
  setFilteredList: (option: OptionType[]) => void;
  options: OptionType[];
  label?: string;
  optionsRef: React.RefObject<ListRef>;
}

export interface InputRef {
  selectOption: (option: OptionType) => void;
}

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      options,
      label,
      onChange,
      setSelectedOption,
      setIsFilteredList,
      isFilteredList,
      filteredList,
      setFilteredList,
      optionsRef,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      selectOption(option: OptionType) {
        selectHandler(option);
      },
    }));

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFilteredList(true);
      const newList = options.filter((el) =>
        new RegExp(
          e.currentTarget.value.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&"),
          "i"
        ).test(el.label)
      );
      setFilteredList(newList);
    };

    const selectHandler = (el: OptionType) => {
      if (el.isDisabled) return;
      if (onChange) onChange(el);
      inputRef.current!.value = el.label;
      setSelectedOption(el);
      setIsFilteredList(false);
    };

    const blurHandler = () => {
      const inputValue = inputRef.current?.value;
      if (options.filter((el) => inputValue === el.label).length !== 1) {
        inputRef.current!.value = "";
        setFilteredList(options);
      }
      setIsFilteredList(false);
    };

    const clearHandler = (e: any) => {
      inputRef.current!.focus();
      inputRef.current!.value = "";
      e.currentTarget!.value = "";
      setFilteredList(options);
      setSelectedOption(null);
      if (onChange) onChange(null);
    };

    const dropDownHandler = () => {
      inputRef.current!.focus();
      setIsFilteredList(!isFilteredList);
    };

    const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isFilteredList || filteredList.length === 0) return;
      if (e.key === "ArrowUp") {
        optionsRef.current!.prevHover();
      }
      if (e.key === "ArrowDown") {
        optionsRef.current!.nextHover();
      }
      if (e.key === "Enter") {
        selectHandler(optionsRef.current!.getHovered());
      }
    };

    return (
      <>
        <input
          onKeyDown={(e) => keyDownHandler(e)}
          onFocus={() => setIsFilteredList(true)}
          onBlur={blurHandler}
          ref={inputRef}
          placeholder="placeholder"
          className={cl.input}
          onChange={(e) => changeHandler(e)}
          type="text"
        />
        <div onClick={() => inputRef.current?.focus()} className={cl.label}>
          {label}
        </div>
        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearHandler}
          className={cl.close_btn}
        >
          <CloseIcon className={cl.close_btn_icon} />
        </IconButton>
        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={dropDownHandler}
          className={cl.drop_btn}
        >
          <ArrowDropDownIcon
            className={
              isFilteredList
                ? [cl.drop_btn_icon, cl._reverse].join(" ")
                : cl.drop_btn_icon
            }
          />
        </IconButton>
      </>
    );
  }
);

export default Input;
