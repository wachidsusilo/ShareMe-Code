import { LegacyRef } from "react";

export interface IconProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
    className?: string
    containerClassName?: string
    width?: string | number
    height?: string | number
    containerRef?: LegacyRef<HTMLDivElement>
    iconRef?: LegacyRef<SVGSVGElement>
}
