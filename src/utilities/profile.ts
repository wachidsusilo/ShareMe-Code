import { auth } from ".."
import { getProfile } from "../firebase/database"

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

export const getProfileName = (author: string) => {
    return author.length === 0 ? 'Guest' : getProfile(author).name
}

export const toFilterFormat = (userId: string) => {
    if(userId === getActiveProfileId()) return '@me'
    return `@${userId.substring(userId.indexOf('@')).toLowerCase()}`
}

export const getProfilePicture = (author: string) => {
    return author.length === 0 ? null : getProfile(author).picture
}

export const getProfileColor = (authorId: string) => {
    const arr = getProfileName(authorId).split(' ')
    const alias = (arr.length > 1) ? arr[0].charAt(0).toUpperCase() + arr[1].charAt(0).toUpperCase() : arr[0].charAt(0).toUpperCase()
    return (alias.length > 1) ? COLORS[(alias.charCodeAt(0) + alias.charCodeAt(1) - 130) % 19] : COLORS[(alias.charCodeAt(0) - 65) % 19]
}

export const getActiveProfileName = () => {
    return auth.currentUser ? auth.currentUser.displayName ?? 'Guest' : 'Guest'
}

export const getActiveProfileId = () => {
    return auth.currentUser ? auth.currentUser.email ?? '' : ''
}