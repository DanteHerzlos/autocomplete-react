import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  RefObject,
} from "react";
import cl from "../../styles/components/UI/List.module.css";
import {
  getNextOptionIndex,
  getPrevOptionIndex,
} from "Autocomplete/utils/getNextIndex";
import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import { InputRef } from "./Input";
import { Option } from "./Option";

interface ListProps {
  options: OptionType[];
  selectedOption: OptionType | null;
  visible: boolean;
  noOptionMessage: string;
  inputRef: RefObject<InputRef>;
  isDefOptions: boolean;
}

export interface ListRef {
  nextHover: () => void;
  prevHover: () => void;
  getHovered: () => OptionType;
}

const List = forwardRef<ListRef, ListProps>(
  (
    {
      options,
      isDefOptions,
      selectedOption,
      visible,
      noOptionMessage,
      inputRef,
    },
    ref,
  ) => {
    const [hoveredOption, setHoveredOption] = useState<{
      option: OptionType;
      index: number;
    }>({ option: options[0], index: 0 });
    const optionsRef = useRef<HTMLParagraphElement[] | null[]>([]);

    useEffect(() => {
      const firstEnabled = options.findIndex((el) => !el.isDisabled);
      if (firstEnabled !== -1) {
        setHoveredOption({
          option: options[firstEnabled],
          index: firstEnabled,
        });
      }
    }, [options]);

    useImperativeHandle(ref, () => ({
      prevHover() {
        const prevIndex = getPrevOptionIndex(options, hoveredOption.index);
        if (prevIndex === -1) return;
        optionsRef.current[prevIndex]!.scrollIntoView({ block: "nearest" });
        setHoveredOption({ option: options[prevIndex], index: prevIndex });
      },
      nextHover() {
        const nextIndex = getNextOptionIndex(options, hoveredOption.index);
        if (nextIndex === -1) return;
        optionsRef.current[nextIndex]!.scrollIntoView({ block: "nearest" });
        setHoveredOption({ option: options[nextIndex], index: nextIndex });
      },
      getHovered() {
        return hoveredOption.option;
      },
    }));

    const mouseOptionHover = (option: OptionType, index: number) => {
      setHoveredOption({ option, index });
    };

    let listStyle = "default";
    if (visible && isDefOptions) listStyle = "disabled";
    if (!visible) listStyle = "hide";

    return (
      <div
        onMouseDown={(e) => e.preventDefault()}
        className={
          {
            default: cl.filteredList,
            hide: [cl.filteredList, cl._hide].join(" "),
            disabled: [cl.filteredList, cl._disable].join(" "),
          }[listStyle]
        }
      >
        {options.length !== 0 ? (
          options.map((el, i) => (
            <Option
              key={el.label}
              option={el}
              optionRef={(element) => (optionsRef.current[i] = element)}
              isHovered={hoveredOption.option.label === el.label}
              isSelected={
                (selectedOption && selectedOption.label === el.label) || false
              }
              onMouseEnter={() => mouseOptionHover(el, i)}
              onClick={() => inputRef.current!.selectOption(el)}
            />
          ))
        ) : (
          <p className={cl.noOptions}>{noOptionMessage}</p>
        )}
      </div>
    );
  },
);

export default List;
