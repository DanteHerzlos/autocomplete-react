import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import cl from "../../styles/components/UI/Option.module.css";

interface OptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  isSelected: boolean;
  isHovered: boolean;
  option: OptionType;
  optionRef: React.LegacyRef<HTMLParagraphElement>;
}

export function Option ({
  isHovered,
  isSelected,
  option,
  optionRef,
  ...props
}: OptionProps) {
  let optionStyle = "default";
  if (option.isDisabled) {
    optionStyle = "disabled";
  } else if (isSelected) {
    optionStyle = "selected";
  } else if (isHovered) {
    optionStyle = "hovered";
  }
  return (
    <p
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
      {option.label}
    </p>
  );
};

