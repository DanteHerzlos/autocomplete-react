import { OptionType } from "../../types/AutocompleteTypes";
import cl from "../../styles/components/UI/Option.module.css";

interface OptionProps extends React.HTMLAttributes<HTMLDivElement> {
  checkbox?: boolean;
  isSelected: boolean;
  isHovered: boolean;
  option: OptionType;
  optionRef: React.LegacyRef<HTMLDivElement>;
}

export function Option({
  checkbox = false,
  isHovered,
  isSelected,
  option,
  optionRef,
  ...props
}: OptionProps) {
  let optionStyle = "default";
  if (option.isDisabled) {
    optionStyle = "disabled";
  } else if (isSelected && !checkbox) {
    optionStyle = "selected";
  } else if (isHovered) {
    optionStyle = "hovered";
  }
  return (
    <div
      {...props}
      ref={optionRef}
      className={
        {
          default: cl.option,
          hovered: [cl.option, cl._hover].join(" "),
          selected: [cl.option, cl._selected].join(" "),
          disabled: [cl.option, cl._disabled].join(" "),
        }[optionStyle]
      }
    >
      {checkbox && (
        <input
          className={cl.checkbox}
          readOnly
          type="checkbox"
          disabled={option.isDisabled}
          checked={isSelected}
        />
      )}
      <span>{option.label}</span>
    </div>
  );
}
