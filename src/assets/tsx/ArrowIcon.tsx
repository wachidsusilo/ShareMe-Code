import { IconProps } from "../../properties/property"
import Base from "./Base"

function ArrowIcon(props: IconProps) {
    return (
        <Base {...props}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M7 10l5 5 5-5H7z" />
            </svg>
        </Base>
    )
}

export default ArrowIcon