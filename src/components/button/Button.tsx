import { ComponentType, LegacyRef, MouseEventHandler, MutableRefObject, useEffect, useRef } from 'react'
import ButtonModel from '../../model/button'
import './Button.scss'

interface ButtonProps {
    label?: string
    hidden?: boolean
    disabled?: boolean
    buttonRef?: MutableRefObject<ButtonModel>
    backgroundColor?: string
    iconOnly?: boolean
    iconOnlyOnMinWidth?: string
    iconOnlyOnMaxWidth?: string
    icon?: ComponentType<any>
    onClick?: MouseEventHandler<HTMLDivElement>
}

function Button({ label = '', hidden = false, disabled = false, buttonRef, backgroundColor, icon, iconOnly, iconOnlyOnMinWidth, iconOnlyOnMaxWidth, onClick }: ButtonProps) {
    const bodyRef: LegacyRef<HTMLDivElement> = useRef(null)
    const labelRef: LegacyRef<HTMLDivElement> = useRef(null)
    const disabledRef: MutableRefObject<boolean> = useRef(disabled)
    const Icon = icon;

    useEffect(() => {
        const body = bodyRef.current
        const label = labelRef.current

        if (body) {
            body.onmousedown = () => {
                if (!disabledRef.current) body.style.transform = 'scale(0.9)'
            }

            body.onmouseup = () => {
                if (!disabledRef.current) body.style.transform = 'scale(1)'
            }

            body.onmouseout = () => {
                if (!disabledRef.current) body.style.transform = 'scale(1)'
            }

            body.ontouchstart = () => {
                if (!disabledRef.current) body.style.transform = 'scale(0.9)'
            }

            body.ontouchend = () => {
                if (!disabledRef.current) body.style.transform = 'scale(1)'
            }

            if (buttonRef) {
                buttonRef.current.show = () => {
                    if(body.style.display !== 'flex') {
                        body.style.display = 'flex'
                    }
                }

                buttonRef.current.hide = () => {
                    if(body.style.display !== 'none') {
                        body.style.display = 'none'
                    }
                }

                buttonRef.current.disabled = () => {
                    if (!disabledRef.current) {
                        body.style.backgroundColor = '#818181'
                        disabledRef.current = true
                    }
                }

                buttonRef.current.enabled = () => {
                    if (disabledRef.current) {
                        body.style.backgroundColor = backgroundColor ? backgroundColor : '#af166f'
                        disabledRef.current = false
                    }
                }
            }

            if (disabledRef.current) {
                body.style.backgroundColor = '#818181'
                disabledRef.current = true
            }
        }

        if (label) {
            const showIconOnly = () => {
                if (!label.classList.contains('hide')) {
                    label.classList.add('hide')
                } else if ((iconOnlyOnMinWidth && window.innerWidth < parseInt(iconOnlyOnMinWidth))
                    || (iconOnlyOnMaxWidth && window.innerWidth > parseInt(iconOnlyOnMaxWidth))) {
                    label.classList.remove('hide')
                }
            }

            if (iconOnlyOnMinWidth) {
                window.matchMedia(`(min-width: ${iconOnlyOnMinWidth})`).addEventListener('change', showIconOnly)
            }

            if (iconOnlyOnMaxWidth) {
                window.matchMedia(`(max-width: ${iconOnlyOnMaxWidth})`).addEventListener('change', showIconOnly)
            }

            return () => {
                if (iconOnlyOnMinWidth) {
                    window.matchMedia(`(min-width: ${iconOnlyOnMinWidth})`).removeEventListener('change', showIconOnly)
                }

                if (iconOnlyOnMaxWidth) {
                    window.matchMedia(`(max-width: ${iconOnlyOnMaxWidth})`).removeEventListener('change', showIconOnly)
                }
            }
        }

    }, [iconOnlyOnMinWidth, iconOnlyOnMaxWidth, buttonRef, backgroundColor])

    const onClickBody: MouseEventHandler<HTMLDivElement> = (e) => {
        if (!disabledRef.current && onClick) {
            onClick(e)
        }
    }

    const isMatches = (iconOnlyOnMinWidth && window.innerWidth >= parseInt(iconOnlyOnMinWidth))
        || (iconOnlyOnMaxWidth && window.innerWidth <= parseInt(iconOnlyOnMaxWidth))

    return (
        <div
            ref={bodyRef}
            className='button'
            onClick={onClickBody}
            style={{ backgroundColor: backgroundColor ? disabled ? '#818181' : backgroundColor : '', display: hidden ? 'none' : 'flex' }}>
            {Icon ?
                <Icon className='button-icon' onClick={() => { }} />
                :
                ''
            }
            <div ref={labelRef} className={`button-label ${iconOnly || isMatches ? 'hide' : ''}`}>{label}</div>
        </div>
    )
}

export default Button
