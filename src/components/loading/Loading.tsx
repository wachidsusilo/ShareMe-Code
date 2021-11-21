import { LegacyRef } from 'react'
import './Loading.scss'

interface LoadingProps {
    bodyRef?: LegacyRef<HTMLDivElement>
    hidden?: boolean
    className?: string
}

function Loading({ bodyRef, hidden = false, className }: LoadingProps) {
    return (
        <div ref={bodyRef} className={`loading ${className}`} style={{display: hidden ? 'none' : 'flex'}}>
            <div className='loading-icon'>
                <span></span>
            </div>
        </div>
    )
}

export default Loading
