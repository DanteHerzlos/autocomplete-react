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
} from "../../utils/getGroupedIndex";
import { GroupBase, OptionType } from "../../types/AutocompleteTypes";
import { InputRef } from "./Input";
import { Option } from "./Option";

interface GroupedVirtualListProps {
  checkbox: boolean;
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
      checkbox,
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
    ref,
  ) => {
    const [hoveredOption, setHoveredOption] = useState<{
      option: OptionType;
      index: number[];
    }>({
      option:
        groupedOptions.length === 0
          ? ({} as OptionType)
          : groupedOptions[0].options[0],
      index: [0, 0],
    });
    const groupedOptionsRef = useRef<HTMLParagraphElement[][] | null[][]>(
      [...new Array(groupedOptions.length)].map(() => []),
    );

    //Virtual props
    const [start, setStart] = useState(0);
    const renderEl = Math.ceil(listHi / optionHi) + 4;
    const listRef = useRef<HTMLParagraphElement>(null);

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const top = e.currentTarget.scrollTop;
      const startEl = Math.ceil(
        (top - (renderEl / 2) * optionHi + listHi / 2) / optionHi,
      );
      if (start !== startEl) {
        setStart(Math.max(startEl, 0));
      }
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
          hoveredOption.index,
        );

        if (prevIndex === -1) return;
        let sum = 0;
        for (let i = 0; i < prevIndex[0]; i++) {
          const len = groupedOptions[i].options.length;
          if (len === 0) continue;
          sum += len + 1;
        }
        sum += prevIndex[1];
        const prevScrollPos = sum * optionHi - 5;
        const scrollTop = listRef.current!.scrollTop;
        if (scrollTop > prevScrollPos || scrollTop + listHi < prevScrollPos) {
          listRef.current?.scrollTo(0, prevScrollPos);
        }

        setHoveredOption({
          option: groupedOptions[prevIndex[0]].options[prevIndex[1]],
          index: prevIndex,
        });
      },
      nextHover() {
        const nextIndex = getNextOptionIndex(
          groupedOptions,
          hoveredOption.index,
        );
        if (nextIndex === -1) return;
        let sum = 0;
        for (let i = 0; i < nextIndex[0]; i++) {
          const len = groupedOptions[i].options.length;
          if (len === 0) continue;
          sum += len + 1;
        }
        sum += nextIndex[1] + 2;
        const scrollTop = listRef.current!.scrollTop;
        const nextScrollPos = sum * optionHi - listHi + 10;
        if (scrollTop - listHi > nextScrollPos || scrollTop < nextScrollPos) {
          listRef.current?.scrollTo(0, nextScrollPos);
        }
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
      let localStart = start;
      let count = renderEl;
      let sum = 0;
      for (let i = 0; i < groupedOptions.length; i++) {
        const len = groupedOptions[i].options.length;
        if (len !== 0) {
          sum += len + 1;
        }
        if (sum >= localStart) {
          if (sum === localStart + len + 1) {
            arr.push({
              el: {
                label: groupedOptions[i].label,
                options: null,
              },
              group_index: i,
              element_index: -1,
            });
          }
          const begin = len + 1 - (sum - localStart);
          for (let j = begin; j < Math.min(len, begin + count); j++) {
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
              <Fragment key={start + i}>
                {option.el.hasOwnProperty("options") ? (
                  <p
                    style={{
                      transform: `translateY(${(start + i) * optionHi}px)`,
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
                    checkbox={checkbox}
                    option={option.el}
                    optionRef={(element) => {
                      const refCurrent = groupedOptionsRef.current;
                      if (refCurrent.length <= option.group_index) {
                        refCurrent.push([]);
                      }
                      refCurrent[option.group_index][option.element_index] =
                        element;
                    }}
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
                      transform: `translateY(${(start + i) * optionHi}px)`,
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
  },
);

export default GroupedVirtualList;
