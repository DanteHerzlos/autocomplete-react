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

interface ListProps {
  options: OptionType[];
  selectedOption: OptionType | null;
  visible: boolean;
  noOptionMessage: string;
  inputRef: RefObject<InputRef>
}

export interface ListRef {
  nextHover: () => void;
  prevHover: () => void;
  getHovered: () => OptionType;
}

const List = forwardRef<ListRef, ListProps>(
  (
    { options, selectedOption, visible, noOptionMessage, inputRef },
    ref
  ) => {
    const [hoveredOption, setHoveredOption] = useState<OptionType>(options[0]);
    const [hoveredIndex, setHoveredIndex] = useState<number>(0);
    const optionsRef = useRef<HTMLParagraphElement[] | null[]>([]);

    useEffect(() => {
      const firstEnabled = options.findIndex((el) => !el.isDisabled);
      if (firstEnabled !== -1) {
        setHoveredIndex(firstEnabled);
        setHoveredOption(options[firstEnabled]);
      }
    }, [options]);

    useImperativeHandle(ref, () => ({
      prevHover() {
        const prevIndex = getPrevOptionIndex(options, hoveredIndex);
        if (prevIndex === -1) return;
        optionsRef.current[prevIndex]!.scrollIntoView({ block: "nearest" });
        setHoveredOption(options[prevIndex]);
        setHoveredIndex(prevIndex);
      },
      nextHover() {
        const nextIndex = getNextOptionIndex(options, hoveredIndex);
        if (nextIndex === -1) return;
        optionsRef.current[nextIndex]!.scrollIntoView({ block: "nearest" });
        setHoveredOption(options[nextIndex]);
        setHoveredIndex(nextIndex);
      },
      getHovered() {
        return hoveredOption;
      },
    }));

    const mouseOptionHover = (option: OptionType, index: number) => {
      setHoveredOption(option);
      setHoveredIndex(index);
    };

    return (
      <div
        onMouseDown={(e) => e.preventDefault()}
        className={
          {
            default: cl.filteredList,
            hide: [cl.filteredList, cl._hide].join(" "),
          }[visible ? "default" : "hide"]
        }
      >
        {options.length !== 0 ? (
          options.map((el, i) => {
            let optionStyle = "default";
            if (el.isDisabled) {
              optionStyle = "disabled";
            } else if (selectedOption && selectedOption.label === el.label) {
              optionStyle = "selected";
            } else if (hoveredOption.label === el.label) {
              optionStyle = "hovered";
            }
            return (
              <p
                key={el.label}
                ref={(element) => (optionsRef.current[i] = element)}
                className={
                  {
                    default: cl.option,
                    hovered: [cl.option, cl._hover].join(" "),
                    selected: [cl.option, cl._selected].join(" "),
                    disabled: [cl.option, cl._disabled].join(" "),
                  }[optionStyle]
                }
                onMouseEnter={() => mouseOptionHover(el, i)}
                onClick={() => inputRef.current!.selectOption(el)}
              >
                {el.label}
              </p>
            );
          })
        ) : (
          <p className={cl.noOptions}>{noOptionMessage}</p>
        )}
      </div>
    );
  }
);

export default List;
