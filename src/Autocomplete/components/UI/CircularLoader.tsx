import cl from "../../styles/components/UI/CircularLoader.module.css"

const CircularLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  return (
    <div {...props} className={[cl.loader, props.className].join(" ")}>
      <svg className={cl.circular} viewBox="25 25 50 50">
        <circle className={cl.path} cx="50" cy="50" r="20"></circle>
      </svg>
    </div>
  )
}

export default CircularLoader
