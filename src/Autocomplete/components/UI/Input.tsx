import { OptionType } from "../../types/AutocompleteTypes";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import IconButton from "./IconButton";
import CloseIcon from "../icons/CloseIcon";
import ArrowDropDownIcon from "../icons/ArrowDropDownIcon";
import cl from "../../styles/components/UI/Input.module.css";
import { ListRef } from "./List";
import { Filtration } from "../../utils/Filtration";
import CircularLoader from "./CircularLoader";

interface InputProps {
  readonly?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: OptionType;
  required?: boolean;
  onChangeInput?: (event: string) => void;
  onChange?: (event: OptionType | null) => void;
  setSelectedOption: (option: OptionType | null) => void;
  selectedOption: OptionType | null;
  setIsFilteredList: (visible: boolean) => void;
  isFilteredList: boolean;
  filteredList: OptionType[];
  setFilteredList: (option: OptionType[]) => void;
  options: OptionType[];
  label?: string;
  optionsRef: React.RefObject<ListRef>;
  isDefOptions: boolean;
  caseSensetive: boolean;
}

export interface InputRef {
  selectOption: (option: OptionType) => void;
  reset: () => void;
}

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      readonly = false,
      disabled = false,
      isLoading = false,
      caseSensetive,
      defaultValue,
      required,
      options,
      label,
      onChange,
      onChangeInput,
      setSelectedOption,
      selectedOption,
      setIsFilteredList,
      isFilteredList,
      filteredList,
      setFilteredList,
      optionsRef,
      isDefOptions,
    },
    ref,
  ) => {
    const [invalid, setInvalid] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      selectOption(option: OptionType) {
        selectHandler(option);
        setFilteredList(options);
      },
      reset() {
        inputRef.current!.value = "";
        setFilteredList(options);
        setSelectedOption(null);
        if (onChangeInput) onChangeInput("");
        if (onChange) onChange(null);
      },
    }));

    // TODO change
    useEffect(() => {
      if (defaultValue) {
        selectHandler(defaultValue);
        setFilteredList(options);
      }
    }, [defaultValue]);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (invalid) setInvalid(false);
      if (onChangeInput) onChangeInput(e.currentTarget.value);
      setIsFilteredList(true);
      const newList = Filtration.byString(
        options,
        e.currentTarget.value,
        caseSensetive,
      );
      setFilteredList(newList);
    };

    const selectHandler = (el: OptionType) => {
      if (el.isDisabled) return;
      if (invalid) setInvalid(false);
      if (onChange) onChange(el);
      if (onChangeInput) onChangeInput(el.label);
      inputRef.current!.value = el.label;
      setSelectedOption(el);
      setIsFilteredList(false);
      const newList = Filtration.byString(options, el.label, caseSensetive);
      setFilteredList(newList);
    };

    const blurHandler = () => {
      if (selectedOption === null) {
        inputRef.current!.value = "";
        if (onChangeInput) onChangeInput("");
        setFilteredList(options);
      } else {
        inputRef.current!.value = selectedOption.label;
        if (onChangeInput) onChangeInput(selectedOption.label);
        setFilteredList(options);
        // const newList = Filtration.byString(options, selectedOption.label);
        // setFilteredList(newList);
      }
      setIsFilteredList(false);
    };

    const clearHandler = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      e.preventDefault();
      inputRef.current!.focus();
      inputRef.current!.value = "";
      setFilteredList(options);
      setSelectedOption(null);
      if (onChangeInput) onChangeInput("");
      if (onChange) onChange(null);
    };

    const dropDownHandler = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      e.preventDefault();
      inputRef.current!.focus();
      setIsFilteredList(!isFilteredList);
    };

    const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isDefOptions && e.key !== "Enter") return;
      const notDisabled = Filtration.byDisabled(filteredList);
      if (!isFilteredList || notDisabled.length === 0) return;
      if (e.key === "ArrowUp") {
        optionsRef.current!.prevHover();
      }
      if (e.key === "ArrowDown") {
        optionsRef.current!.nextHover();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (isDefOptions) return;
        selectHandler(optionsRef.current!.getHovered());
      }
    };

    function onFocusHandler() {
      if (!readonly) setIsFilteredList(true);
    }

    return (
      <>
        <input
          readOnly={readonly}
          disabled={disabled || isLoading}
          defaultValue={defaultValue ? defaultValue.label : ""}
          onInvalid={(e) => {
            e.preventDefault();
            setInvalid(true);
          }}
          required={required}
          onKeyDown={(e) => keyDownHandler(e)}
          onFocus={onFocusHandler}
          onBlur={blurHandler}
          ref={inputRef}
          placeholder="placeholder"
          className={invalid ? [cl.input, cl._invalid].join(" ") : cl.input}
          onChange={(e) => changeHandler(e)}
          type="text"
        />
        <div onClick={() => inputRef.current?.focus()} className={cl.label}>
          {label}
        </div>
        {isLoading && (
          <CircularLoader style={{ width: "2rem" }} className={cl.loader} />
        )}
        {!isLoading && !readonly && (
          <IconButton
            disabled={disabled || isLoading}
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearHandler}
            className={cl.close_btn}
          >
            <CloseIcon className={cl.close_btn_icon} />
          </IconButton>
        )}
        {!readonly && (
          <IconButton
            disabled={disabled || isLoading}
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
        )}
        {invalid && (
          <span className={cl.invalid_message}>
            {inputRef.current?.validationMessage}
          </span>
        )}
      </>
    );
  },
);

export default Input;
