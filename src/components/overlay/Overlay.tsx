import { LegacyRef, MutableRefObject, useEffect, useRef } from 'react'
import OverlayAction from '../../model/overlay'
import './Overlay.scss'

interface OverlayProps {
    zIndex?: number
    overlayRef?: MutableRefObject<OverlayAction>
    onClick?: () => void
}

const classShow = 'overlay-show'

function Overlay({zIndex, overlayRef, onClick}: OverlayProps) {
    const bodyRef: LegacyRef<HTMLDivElement> = useRef(null)

    useEffect(() => {
        const body = bodyRef.current

        if(body && overlayRef) {

            body.onclick = () => {
                if(onClick) onClick()
                overlayRef.current.hide()
            }

            overlayRef.current.show = () => {
                if(!body.classList.contains(classShow)) {
                    body.style.width = '100vw'
                    body.classList.add(classShow)
                }
            }

            overlayRef.current.hide = () => {
                if(body.classList.contains(classShow)) {
                    body.ontransitionend = () => {
                        body.ontransitionend = null
                        body.style.width = '0'
                    }
                    body.classList.remove(classShow)
                }
            }
            
        }
    }, [overlayRef, onClick])

    return (
        <div ref={bodyRef} className='overlay' style={{zIndex: zIndex}} />
    )
}

export default Overlay
