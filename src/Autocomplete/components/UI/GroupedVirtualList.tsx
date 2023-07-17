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
    ref,
  ) => {
    const [hoveredOption, setHoveredOption] = useState<{
      option: OptionType;
      index: number[];
    }>({ option: groupedOptions[0].options[0], index: [0, 0] });
    const groupedOptionsRef = useRef<HTMLParagraphElement[][] | null[][]>(
      [...new Array(groupedOptions.length)].map(() => []),
    );

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
          hoveredOption.index,
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
            height: `${options.length * optionHi}px`,
            position: "relative",
          }}
        >
          {groupedOptions.length !== 0 ? (
            groupedOptions.map((options, i) =>
              options.options.map((el, j) =>
                j === 0 ? (
                  <Fragment key={el.label}>
                    <p className={[groupClassName, cl.group].join(" ")}>
                      {options.label}
                    </p>
                    <Option
                      key={el.label}
                      option={el}
                      optionRef={(element) =>
                        (groupedOptionsRef.current[i][j] = element)
                      }
                      isHovered={hoveredOption.option.label === el.label}
                      isSelected={
                        (selectedOption && selectedOption.label === el.label) ||
                        false
                      }
                      onMouseEnter={() => mouseOptionHover(el, [i, j])}
                      onClick={() => inputRef.current!.selectOption(el)}
                    />
                  </Fragment>
                ) : (
                  <Option
                    key={el.label}
                    option={el}
                    optionRef={(element) =>
                      (groupedOptionsRef.current[i][j] = element)
                    }
                    isHovered={hoveredOption.option.label === el.label}
                    isSelected={
                      (selectedOption && selectedOption.label === el.label) ||
                      false
                    }
                    onMouseEnter={() => mouseOptionHover(el, [i, j])}
                    onClick={() => inputRef.current!.selectOption(el)}
                  />
                ),
              ),
            )
          ) : (
            <p className={cl.noOptions}>{noOptionMessage}</p>
          )}
        </div>
      </div>
    );
  },
);

export default GroupedVirtualList;
