import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  RefObject,
  Fragment,
} from "react";
import cl from "../../styles/components/UI/List.module.css";
import {
  getNextOptionIndex,
  getPrevOptionIndex,
} from "../../utils/getNextIndex";
import { OptionType } from "../../types/AutocompleteTypes";
import { InputRef } from "./Input";
import { Option } from "./Option";

interface VirtualListProps {
  checkbox: boolean;
  optionHi?: number;
  listHi?: number;
  options: OptionType[];
  selectedOption: OptionType | null;
  visible: boolean;
  noOptionMessage: string;
  inputRef: RefObject<InputRef>;
  isDefOptions: boolean;
}

export interface VirtualListRef {
  nextHover: () => void;
  prevHover: () => void;
  getHovered: () => OptionType;
}

const VirtualList = forwardRef<VirtualListRef, VirtualListProps>(
  (
    {
      checkbox,
      optionHi = 30,
      listHi = 300,
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

    //Virtual props
    const [start, setStart] = useState(0);
    const renderEl = Math.ceil(listHi / optionHi) + 8;
    const arr = new Array(renderEl).fill(0);
    const listRef = useRef<HTMLParagraphElement>(null);

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const top = e.currentTarget.scrollTop;
      const startEl = Math.ceil(
        (top - (renderEl / 2) * optionHi + listHi / 2) / optionHi,
      );
      if (start !== startEl) setStart(startEl);
    };
    ////////////////////////

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
        const prevScrollPos = prevIndex * optionHi - 5;
        const scrollTop = listRef.current!.scrollTop;
        if (scrollTop > prevScrollPos || scrollTop + listHi < prevScrollPos) {
          listRef.current?.scrollTo(0, prevScrollPos);
        }
        setHoveredOption({ option: options[prevIndex], index: prevIndex });
      },
      nextHover() {
        const nextIndex = getNextOptionIndex(options, hoveredOption.index);
        if (nextIndex === -1) return;
        const nextScrollPos = (nextIndex + 1) * optionHi - listHi + 10;
        const scrollTop = listRef.current!.scrollTop;
        if (scrollTop - listHi > nextScrollPos || scrollTop < nextScrollPos) {
          listRef.current?.scrollTo(0, nextScrollPos);
        }
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
        ref={listRef}
        onMouseDown={(e) => e.preventDefault()}
        className={
          {
            default: cl.filteredList,
            hide: [cl.filteredList, cl._hide].join(" "),
            disabled: [cl.filteredList, cl._disable].join(" "),
          }[listStyle]
        }
        onScrollCapture={onScrollHandler}
      >
        {options.length === 0 ? (
          <p className={cl.noOptions}>{noOptionMessage}</p>
        ) : (
          <div
            style={{
              height: `${options.length * optionHi}px`,
              position: "relative",
            }}
          >
            {arr.map((_, index) => (
              <Fragment key={start + index}>
                {options.length > start + index && start + index >= 0 && (
                  <Option
                    checkbox={checkbox}
                    option={options[start + index]}
                    optionRef={(element) =>
                      (optionsRef.current[start + index] = element)
                    }
                    isSelected={
                      (selectedOption &&
                        selectedOption.label ===
                          options[start + index].label) ||
                      false
                    }
                    isHovered={
                      hoveredOption.option.label ===
                      options[start + index].label
                    }
                    onMouseEnter={() =>
                      mouseOptionHover(options[start + index], start + index)
                    }
                    onClick={() =>
                      inputRef.current!.selectOption(options[start + index])
                    }
                    style={{
                      transform: `translateY(${(start + index) * optionHi}px)`,
                      position: "absolute",
                      width: "100%",
                      height: optionHi,
                    }}
                  />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default VirtualList;
