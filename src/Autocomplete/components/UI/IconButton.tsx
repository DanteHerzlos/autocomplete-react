import cl from "../../styles/components/UI/IconButton.module.css"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  disabled?: boolean
  children?: React.ReactElement
}

const IconButton: React.FC<IconButtonProps> = ({
  disabled = false,
  children,
  className = "",
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={
        disabled
          ? [cl.btn, cl._disable, className].join(" ")
          : [cl.btn, className].join(" ")
      }
    >
      {children}
    </button>
  )
}

export default IconButton
