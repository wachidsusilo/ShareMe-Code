import { LegacyRef, MouseEventHandler, MutableRefObject, useEffect, useRef } from 'react'
import './Avatar.scss'

const COLORS = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d'
]

const getAlias = (username: string) => {
    const arr = username.split(' ')
    if (arr.length > 1) return arr[0].charAt(0).toUpperCase() + arr[1].charAt(0).toUpperCase()
    return arr[0].charAt(0).toUpperCase()
}

const getColor = (username: string) => {
    const alias = getAlias(username)
    if (alias.length > 1) return COLORS[(alias.charCodeAt(0) + alias.charCodeAt(1) - 130) % 19]
    return COLORS[(alias.charCodeAt(0) - 65) % 19]
}

export class AvatarModel {
    body: HTMLDivElement | null
    onReady: (body: HTMLDivElement) => void

    constructor() {
        this.body = null
        this.onReady = () => { }
    }
}

interface AvatarProps {
    username?: string
    avatarRef?: MutableRefObject<AvatarModel>
    picture?: string | null
    onClick?: MouseEventHandler<HTMLDivElement>
    width?: string
    height?: string
    borderRadius?: string
    className?: string
}

function Avatar({ username = '', avatarRef, picture, onClick, width, height, borderRadius, className }: AvatarProps) {
    const alias = getAlias(username)
    const cardRef: LegacyRef<HTMLDivElement> = useRef(null)

    useEffect(() => {
        const card = cardRef.current
        if (card) {
            const fontSize = (card.clientWidth * (alias.length > 1 ? 0.44 : 0.55))
            if(fontSize > 0) card.style.fontSize = fontSize + 'px'

            if (avatarRef) {
                avatarRef.current.body = card
                avatarRef.current.onReady(card)
            }
        }
    })

    return (
        <div
            ref={cardRef}
            className={`avatar ${className}`}
            style={{
                width: width ?? height ?? '40px',
                height: height ?? width ?? '40px',
                borderRadius: borderRadius ?? '50%',
                background: getColor(username),
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick}
        >
            {picture ?
                <img className='avatar-img' crossOrigin='anonymous' src={picture} alt='' />
                :
                <>{alias}</>
            }
        </div>
    )
}

export default Avatar
