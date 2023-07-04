interface ArrowDropDownIcon {
  fill?: string
  className?: string
  onClick?: React.MouseEventHandler<SVGSVGElement>
}

const ArrowDropDownIcon: React.FC<ArrowDropDownIcon> = ({
  fill = "#000000",
  className,
  onClick,
}) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  )
}

export default ArrowDropDownIcon
