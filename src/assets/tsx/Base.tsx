import { cloneElement, ReactElement } from "react"
import { IconProps } from "../../properties/property"

interface BaseProps extends IconProps {
    children?: ReactElement
}

function Base(props: BaseProps) {
    return (
        <div
            ref={props.containerRef}
            className={props.containerClassName}
            style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: props.width,
                height: props.height,
                cursor: props.onClick === undefined ? 'default' : 'pointer'
            }}
            onClick={props.onClick}
        >{props.children ? cloneElement(props.children, {ref: props.iconRef, className: props.className}) : ''}</div>
    )
}

export default Base
