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
  getfirstEnabled,
} from "Autocomplete/utils/getGroupedIndex";
import { GroupBase, OptionType } from "Autocomplete/types/AutocompleteTypes";
import { InputRef } from "./Input";
import { Option } from "./Option";

interface GroupedVirtualListProps {
  optionHi?: number;
  listHi?: number;
  groupedOptions: GroupBase<OptionType>[];
  selectedOption: OptionType | null;
  visible: boolean;
  noOptionMessage: string;
  groupClassName: string;
  inputRef: RefObject<InputRef>;
  isDefOptions: boolean;
}

export interface GroupedVirtualListRef {
  nextHover: () => void;
  prevHover: () => void;
  getHovered: () => OptionType;
}

const GroupedVirtualList = forwardRef<
  GroupedVirtualListRef,
  GroupedVirtualListProps
>(
  (
    {
      optionHi = 30,
      listHi = 300,
      groupedOptions,
      isDefOptions,
      selectedOption,
      visible,
      groupClassName,
      noOptionMessage,
      inputRef,
    },
    ref
  ) => {
    const [hoveredOption, setHoveredOption] = useState<{
      option: OptionType;
      index: number[];
    }>({ option: groupedOptions[0].options[0], index: [0, 0] });
    const groupedOptionsRef = useRef<HTMLParagraphElement[][] | null[][]>(
      [...new Array(groupedOptions.length)].map(() => [])
    );

    //Virtual props
    const [start, setStart] = useState(0);
    const renderEl = Math.ceil(listHi / optionHi) + 8;
    const listRef = useRef<HTMLParagraphElement>(null);

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const top = e.currentTarget.scrollTop;
      const startEl = Math.ceil(
        (top - (renderEl / 2) * optionHi + listHi / 2) / optionHi
      );
      if (start !== startEl) setStart(startEl);
    };
    ////////////////////////

    useEffect(() => {
      let firstEnabled = getfirstEnabled(groupedOptions);
      if (firstEnabled !== -1) {
        setHoveredOption({
          option: groupedOptions[firstEnabled[0]].options[firstEnabled[1]],
          index: firstEnabled,
        });
      }
    }, [groupedOptions]);

    useImperativeHandle(ref, () => ({
      prevHover() {
        const prevIndex = getPrevOptionIndex(
          groupedOptions,
          hoveredOption.index
        );
        if (prevIndex === -1) return;
        groupedOptionsRef.current[prevIndex[0]][prevIndex[1]]!.scrollIntoView({
          block: "nearest",
        });
        setHoveredOption({
          option: groupedOptions[prevIndex[0]].options[prevIndex[1]],
          index: prevIndex,
        });
      },
      nextHover() {
        const nextIndex = getNextOptionIndex(
          groupedOptions,
          hoveredOption.index
        );
        if (nextIndex === -1) return;
        groupedOptionsRef.current[nextIndex[0]][nextIndex[1]]!.scrollIntoView({
          block: "nearest",
        });
        setHoveredOption({
          option: groupedOptions[nextIndex[0]].options[nextIndex[1]],
          index: nextIndex,
        });
      },
      getHovered() {
        return hoveredOption.option;
      },
    }));

    const mouseOptionHover = (option: OptionType, index: number[]) => {
      setHoveredOption({ option, index });
    };

    const sumElements = () => {
      let sum = 0;
      for (let i = 0; i < groupedOptions.length; i++) {
        if (groupedOptions[i].options.length !== 0) {
          sum += groupedOptions[i].options.length + 1;
        }
      }
      return sum;
    };

    const calculateRenderList = () => {
      const arr = [];
      let localStart = Math.max(start, 0);
      let count = Math.ceil(listHi / optionHi) + 4;
      let sum = 0;
      for (let i = 0; i < groupedOptions.length; i++) {
        sum += groupedOptions[i].options.length;
        if (sum >= localStart) {
          const len = groupedOptions[i].options.length;
          const begin = len - (sum - localStart);
          for (let j = begin; j < Math.min(len, count); j++) {
            if (j === 0) {
              arr.push({
                el: {
                  label: groupedOptions[i].label,
                  options: null,
                },
                group_index: i,
                element_index: -1,
              });
            }
            arr.push({
              el: groupedOptions[i].options[j],
              group_index: i,
              element_index: j,
            });
          }
          count -= sum - localStart;
          localStart = sum;
        }
        if (sum > localStart + count) break;
      }
      console.log(arr.length)
      return arr;
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
        <div
          style={{
            height: `${sumElements() * optionHi || 30}px`,
            position: "relative",
          }}
        >
          {sumElements() !== 0 ? (
            calculateRenderList().map((option, i) => (
              <Fragment key={option.el.label}>
                {option.el.hasOwnProperty("options") ? (
                  <p
                    style={{
                      transform: `translateY(${
                        (Math.max(start, 0) + i) * optionHi
                      }px)`,
                      position: "absolute",
                      width: "100%",
                      height: optionHi,
                    }}
                    className={[groupClassName, cl.group].join(" ")}
                  >
                    {option.el.label}
                  </p>
                ) : (
                  <Option
                    key={option.el.label}
                    option={option.el}
                    optionRef={(element) =>
                      (groupedOptionsRef.current[option.group_index][
                        option.element_index
                      ] = element)
                    }
                    isHovered={hoveredOption.option.label === option.el.label}
                    isSelected={
                      (selectedOption &&
                        selectedOption.label === option.el.label) ||
                      false
                    }
                    onMouseEnter={() =>
                      mouseOptionHover(option.el, [
                        option.group_index,
                        option.element_index,
                      ])
                    }
                    onClick={() => inputRef.current!.selectOption(option.el)}
                    style={{
                      transform: `translateY(${
                        (Math.max(start, 0) + i) * optionHi
                      }px)`,
                      position: "absolute",
                      width: "100%",
                      height: optionHi,
                    }}
                  />
                )}
              </Fragment>
            ))
          ) : (
            <p className={cl.noOptions}>{noOptionMessage}</p>
          )}
        </div>
      </div>
    );
  }
);

export default GroupedVirtualList;
