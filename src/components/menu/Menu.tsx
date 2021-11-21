import { LegacyRef, MutableRefObject, useEffect, useRef } from 'react'
import MenuAction from '../../model/menu'
import { LanguageModel } from '../../utilities/language'
import './Menu.scss'

interface MenuProps {
    className?: string
    items?: Array<LanguageModel>
    onItemSelected?: (item: LanguageModel) => void
    menuRef?: MutableRefObject<MenuAction>
}

function Menu({ className, items = [], onItemSelected, menuRef }: MenuProps) {
    const bodyRef: LegacyRef<HTMLDivElement> = useRef(null)

    useEffect(() => {
        const body = bodyRef.current

        if (body && menuRef) {
            menuRef.current.show = () => {
                body.style.maxHeight = '206px'
                body.style.boxShadow = '0 0 0 2px #414141, 0 0 6px 0 black'
                menuRef.current.shown = true
            }

            menuRef.current.hide = () => {
                body.style.maxHeight = '0'
                body.style.boxShadow = '0 0 0 0 #414141'
                menuRef.current.shown = false
            }
        }
    }, [menuRef])

    return (
        <div ref={bodyRef} className={`menu ${className}`}>
            {items.map((value, index) => <div key={index} className='menu-item' onClick={() => {
                if (onItemSelected) onItemSelected(value)
                if (menuRef) menuRef.current.hide()
            }}>{value.name}</div>)}
        </div>
    )
}

export default Menu
