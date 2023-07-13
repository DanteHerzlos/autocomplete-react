import { OptionType } from "Autocomplete/types/AutocompleteTypes";
import cl from "../../styles/components/UI/Option.module.css";

interface OptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  isDisabled: boolean;
  isSelected: boolean;
  isHovered: boolean;
  option: OptionType;
  optionRef: React.LegacyRef<HTMLParagraphElement>;
}

const Option: React.FC<OptionProps> = ({
  isDisabled,
  isHovered,
  isSelected,
  option,
  optionRef,
  ...props
}) => {
  let optionStyle = "default";
  if (isDisabled) {
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

export default Option;

