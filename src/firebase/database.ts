import User from './../model/user'
import Note from '../model/note'
import { database } from './../index'
import { ref, update, push, remove, DatabaseReference, onValue } from 'firebase/database'
import { getActiveProfileId, toFilterFormat } from '../utilities/profile'
import { getCurrentTime } from '../utilities/time'
import { Log } from '../utilities/log'

type SortType = 'title' | 'author' | 'dateCreated' | 'dateModified' | 'modifier'

let tempNote: Note | null = null
const allUsers: Array<User> = []
const allNotes: Array<Note> = []
let notesCallback: (() => void) | null = null
let usersCallback: (() => void) | null = null

const toPath = (text: string) => {
    return text.replace(/[.#$[\]]+/g, '*')
}

const getRef = (...paths: Array<string>) => {
    return ref(database, '/' + paths.join('/'))
}

const validateId = (id: string, ref: DatabaseReference): string | null => {
    if (id.trim().length === 0) {
        return push(ref).key
    }
    return id
}

export const updateProfile = (user: User) => {
    if (user.id.length > 0) {
        update(getRef('public', toPath(user.id)), user)
    }
}

export const updateTempNote = (note: Note) => new Promise<void>((resolve, reject) => {
    if (note.author.length > 0) {
        if (note.content.trim().length > 0) {
            update(getRef('users', toPath(note.author), 'temp_note'), note)
                .then(() => resolve())
                .catch((e) => reject(e))
        } else {
            remove(getRef('users', toPath(note.author), 'temp_note'))
                .then(() => resolve())
                .catch((e) => reject(e))
        }
    } else {
        reject()
    }
})

export const updateNote = (note: Note) => new Promise<Note>((resolve, reject) => {
    if (note.author.length > 0) {
        if (note.private) {
            if (note.id.length > 0) remove(getRef('notes', toPath(note.author), 'public', note.id))
            const id = validateId(note.id, getRef('notes', toPath(note.author), 'private', note.id))
            if (id) {
                note.id = id
                note.dateModified = getCurrentTime()
                update(getRef('notes', toPath(note.author), 'private', note.id), note)
                    .then(() => resolve(note))
                    .catch((e) => reject(e))
            }
        } else {
            if (note.id.length > 0) remove(getRef('notes', toPath(note.author), 'private', note.id))
            const id = validateId(note.id, getRef('notes', toPath(note.author), 'public', note.id))
            if (id) {
                note.id = id
                note.dateModified = getCurrentTime()
                update(getRef('notes', toPath(note.author), 'public', note.id), note)
                    .then(() => resolve(note))
                    .catch((e) => reject(e))
            }
        }
    } else {
        reject()
    }
})

export const removeNote = (noteId: string) => new Promise<void>((resolve, reject) => {
    if (noteId.trim().length > 0) {
        const note = allNotes.find(n => n.id === noteId)
        if (note) {
            if (note.private) {
                remove(getRef('notes', toPath(note.author), 'private', noteId))
                    .then(() => resolve())
                    .catch((e) => reject(e))
            } else {
                remove(getRef('notes', toPath(note.author), 'public', noteId))
                    .then(() => resolve())
                    .catch((e) => reject(e))
            }
        }
    } else {
        reject()
    }
})

export const observeTempNote = (onReady?: () => void) => {
    return onValue(getRef('users', toPath(getActiveProfileId()), 'temp_note'), (result) => {
        const note = result.toJSON()
        if (note) {
            tempNote = Note.from(note as Note)
        } else {
            tempNote = null
        }
        if (onReady) {
            onReady()
            onReady = undefined
        }
    })
}

export const getTempNote = () => {
    return tempNote
}

const sortNotesBy = (type: SortType) => {
    switch (type) {
        case 'title':
            allNotes.sort((a, b) => a.title.localeCompare(b.title))
            break
        case 'author':
            allNotes.sort((a, b) => a.author.localeCompare(b.author))
            break
        case 'dateCreated':
            allNotes.sort((a, b) => b.dateCreated - a.dateCreated)
            break
        case 'dateModified':
            allNotes.sort((a, b) => b.dateModified - a.dateModified)
            break
        case 'modifier':
            allNotes.sort((a, b) => (!a.private && b.private) ? 1 : (a.private && !b.private) ? -1 : 0)
            break
    }
}

export const observeNote = () => {
    return onValue(getRef('notes'), notes => {
        allNotes.splice(0)
        notes.forEach(user => {
            user.forEach(modifier => {
                modifier.forEach(snap => {
                    const note = snap.toJSON()
                    if (note) allNotes.push(Note.from(note as Note))
                })
            })
        })
        sortNotesBy('dateModified')
        if (notesCallback) notesCallback()
    })
}

export const setNotesCallback = (callback: (() => void) | null) => {
    notesCallback = callback
}

export const filterNote = (query: string, userId: string) => {
    Log('filter-note: \'' + query + '\' ' + toFilterFormat(userId))
    if (query.trim().length === 0) {
        if (userId === 'everyone') return allNotes
        return allNotes.filter(note => note.author === userId)
    }
    if (userId === 'everyone') return allNotes.filter(note => note.contains(query.trim(), true))
    return allNotes.filter(note => note.author === userId && note.contains(query.trim(), true))
}

export const getNotes = (userId: string) => {
    if (userId === 'everyone') return allNotes
    return filterNote('', userId)
}

export const observeProfile = (onReady?: () => void) => {
    return onValue(getRef('public'), (result) => {
        allUsers.splice(0)
        result.forEach(snap => {
            const user = snap.toJSON()
            if (user) {
                allUsers.push(User.from(user as User))
            }
        })
        if (onReady) {
            onReady()
            onReady = undefined
        }
        if (usersCallback) usersCallback()
    })
}

export const setUsersCallback = (callback: (() => void) | null) => {
    usersCallback = callback
}

export const getProfile = (userId: string) => {
    return allUsers.find(user => user.id === userId) ?? new User(userId, userId.indexOf('@') >= 0 ? userId.substring(0, userId.indexOf('@')) : userId, null)
}

export const filterUser = (query: string, ...excepts: Array<User>) => {
    Log('filter-user: \'' + query + '\' ' + excepts.map(u => toFilterFormat(u.id)).join(' '))
    const userBuffer: Array<User> = []
    if (!excepts.some(user => user.id === 'everyone')) userBuffer.push(new User('everyone', 'Everyone'))
    if (excepts.some(user => user.id === getActiveProfileId())) {
        userBuffer.push(...allUsers.filter(user => !excepts.some(u => u.id === user.id) && user.contains(query.trim(), true)))
    } else {
        userBuffer.push(...allUsers.filter(user => user.id === getActiveProfileId() || (!excepts.some(u => u.id === user.id) && user.contains(query.trim(), true))))
    }
    return userBuffer
}
