import { LegacyRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import './HeaderDashboard.scss'
import AddIcon from '../../../assets/tsx/AddIcon'
import Avatar, { AvatarModel } from '../../avatar/Avatar'
import Button from '../../button/Button'
import { auth } from '../../..'
import { HeaderDashboardAction } from '../../../model/header'
import { getLanguageColor, getLanguageIcon } from '../../../utilities/language'
import Note from '../../../model/note'
import { getActiveProfileId, getProfileColor, getProfileName } from '../../../utilities/profile'
import MenuIcon from '../../../assets/tsx/MenuIcon'
import LoginIcon from '../../../assets/tsx/LoginIcon'
import LogoutIcon from '../../../assets/tsx/LogoutIcon'
import { signOut } from '@firebase/auth'
import Loading from '../../loading/Loading'
import DeleteIcon from '../../../assets/tsx/DeleteIcon'
import SaveIcon from '../../../assets/tsx/SaveIcon'
import { getUser } from '../../../firebase/account'
import LockIcon from '../../../assets/tsx/LockIcon'
import { BinderData, registerBinder, useBinder } from '../../../utilities/binder'
import { FIELD_BINDER } from '../../../constants/constant'
import icDone from '../../../assets/svg/done.svg'
import { urlToBase64 } from '../../../utilities/image'
import { getTempNote, observeProfile, observeTempNote, removeNote, updateNote, updateProfile, updateTempNote } from '../../../firebase/database'
import User from '../../../model/user'
import ButtonModel from '../../../model/button'
import { Unsubscribe } from '@firebase/database'
import { getCurrentTime } from '../../../utilities/time'
import { observeNote } from './../../../firebase/database';
import { Log } from '../../../utilities/log'

interface HeaderDashboardProps {
    noteRef: MutableRefObject<Note>
    oldNoteRef: MutableRefObject<Note>
    headerDashboardRef?: MutableRefObject<HeaderDashboardAction>
    onClickLogin?: () => void
    onClickMenu?: () => void
    onReady?: () => void
    onNoteChanged?: (newDoc?: boolean) => void
}

const classShow = 'header-dashboard-show'
const classShowMenu = 'header-dashboard-container-menu-show'

function HeaderDashboard({ noteRef, oldNoteRef, headerDashboardRef, onClickLogin, onClickMenu, onReady, onNoteChanged }: HeaderDashboardProps) {
    const [authenticated, setAuthenticated] = useState<boolean>(auth.currentUser !== null)
    const iconRef: LegacyRef<HTMLImageElement> = useRef(null)
    const titleRef: LegacyRef<HTMLDivElement> = useRef(null)
    const lockRef: LegacyRef<HTMLDivElement> = useRef(null)
    const authorRef: LegacyRef<HTMLDivElement> = useRef(null)
    const menuRef: LegacyRef<HTMLDivElement> = useRef(null)
    const menuAccountRef: LegacyRef<HTMLDivElement> = useRef(null)
    const actionRef: LegacyRef<HTMLDivElement> = useRef(null)
    const loadingRef: LegacyRef<HTMLDivElement> = useRef(null)
    const editRef: LegacyRef<HTMLInputElement> = useRef(null)
    const inputRef: LegacyRef<HTMLInputElement> = useRef(null)
    const checkRef: LegacyRef<HTMLInputElement> = useRef(null)
    const modifierRef: LegacyRef<HTMLDivElement> = useRef(null)
    const doneRef: LegacyRef<HTMLImageElement> = useRef(null)
    const avatarRef: MutableRefObject<AvatarModel> = useRef(new AvatarModel())
    const signOutRef: MutableRefObject<boolean> = useRef(false)
    const firstRef: MutableRefObject<boolean> = useRef(true)
    const saveRef: MutableRefObject<ButtonModel> = useRef(new ButtonModel())
    const deleteRef: MutableRefObject<ButtonModel> = useRef(new ButtonModel())
    const fieldBinder = useBinder(FIELD_BINDER)

    useEffect(() => {
        const icon = iconRef.current
        const title = titleRef.current
        const lock = lockRef.current
        const author = authorRef.current
        const menu = menuRef.current
        const action = actionRef.current
        const loading = loadingRef.current
        const edit = editRef.current
        const input = inputRef.current
        const check = checkRef.current
        const modifier = modifierRef.current
        const done = doneRef.current

        let inputBinder: BinderData | null = null
        let accountBinder: BinderData | null = null

        if (title && lock && edit && input && check && modifier && done) {

            const onDone = () => {
                if (edit.style.display === 'flex') {
                    title.innerHTML = input.value.length === 0 ? oldNoteRef.current.title : input.value
                    noteRef.current.title = title.innerHTML
                    noteRef.current.private = check.checked
                    if (noteRef.current.private) {
                        if(lock.classList.contains('hide')) {
                            lock.classList.remove('hide')
                        }
                    } else {
                        if (!lock.classList.contains('hide')) {
                            lock.classList.add('hide')
                        }
                    }
                    edit.style.display = 'none'
                }
            }

            inputBinder = registerBinder(FIELD_BINDER, onDone)

            done.onclick = () => {
                onDone()
            }

            check.onchange = () => {
                noteRef.current.private = check.checked
                headerDashboardRef?.current.update()
            }

            title.onclick = () => {
                if (noteRef.current.author === getActiveProfileId()) {
                    input.value = title.innerHTML
                    check.checked = noteRef.current.private
                    edit.style.display = 'flex'
                    input.focus()
                    input.setSelectionRange(0, input.value.length)
                    inputBinder?.binder.dispatch()
                }
            }

            input.oninput =() => {
                noteRef.current.title = input.value
                if(headerDashboardRef) headerDashboardRef.current.update()
            }

            input.onkeydown = (e) => {
                if (e.key === 'Escape') {
                    edit.style.display = 'none'
                }

                if (e.key === 'Enter') {
                    onDone()
                }
            }

            check.onclick = (e) => {
                e.stopPropagation()
            }

            modifier.onclick = () => {
                check.click()
            }
        }

        if (icon && menu && edit && title && lock && author && headerDashboardRef) {
            headerDashboardRef.current.update = (forceUpdate) => {
                Log('header-update: ' + (forceUpdate ? '[force] ' : '') + (noteRef.current.equals(oldNoteRef.current) ? '[changed] ' : ''))
                if(forceUpdate) edit.style.display = 'none'
                if (noteRef.current.author !== oldNoteRef.current.author || forceUpdate) {
                    author.innerHTML = getProfileName(noteRef.current.author)
                    author.style.color = getProfileColor(noteRef.current.author)
                }

                if (noteRef.current.title !== oldNoteRef.current.title || forceUpdate) {
                    title.innerHTML = noteRef.current.title
                }

                if(noteRef.current.private !== oldNoteRef.current.private || forceUpdate) {
                    if (noteRef.current.private) {
                        if(lock.classList.contains('hide')) {
                            lock.classList.remove('hide')
                        }
                    } else {
                        if (!lock.classList.contains('hide')) {
                            lock.classList.add('hide')
                        }
                    }
                }

                if (noteRef.current.language !== oldNoteRef.current.language || forceUpdate) {
                    icon.src = getLanguageIcon(noteRef.current.language)
                    title.style.color = getLanguageColor(noteRef.current.language)
                }

                if (noteRef.current.author === getUser().id) {
                    saveRef.current.show()

                    if (noteRef.current.id.trim().length > 0) {
                        deleteRef.current.show()
                    } else {
                        deleteRef.current.hide()
                    }

                    if (noteRef.current.equals(oldNoteRef.current) || noteRef.current.content.trim().length === 0 || noteRef.current.title.trim().length === 0) {
                        saveRef.current.disabled()
                    } else {
                        saveRef.current.enabled()
                    }

                } else {
                    saveRef.current.hide()
                    deleteRef.current.hide()
                }
            }

            headerDashboardRef.current.expandMenu = () => {
                if (!menu.classList.contains(classShow)) {
                    menu.classList.add(classShow)
                }
            }

            headerDashboardRef.current.collapseMenu = () => {
                if (menu.classList.contains(classShow)) {
                    menu.classList.remove(classShow)
                }
            }

            const collapseAccountMenu = () => {
                if (menuAccountRef.current && menuAccountRef.current.classList.contains(classShowMenu)) {
                    menuAccountRef.current.classList.remove(classShowMenu)
                }
            }

            accountBinder = registerBinder(FIELD_BINDER, collapseAccountMenu)

            const onClickAvatar = () => {
                if (menuAccountRef.current) {
                    if (menuAccountRef.current.classList.contains(classShowMenu)) {
                        menuAccountRef.current.classList.remove(classShowMenu)
                    } else {
                        menuAccountRef.current.classList.add(classShowMenu)
                    }
                }
                accountBinder?.binder.dispatch()
            }

            if (avatarRef.current.body) {
                avatarRef.current.body.onclick = () => {
                    onClickAvatar()
                }
            }

            avatarRef.current.onReady = (body) => {
                body.onclick = () => {
                    onClickAvatar()
                }
            }

        }

        let unsubProfile: Unsubscribe | null = null
        let unsubTempNote: Unsubscribe | null = null
        let unsubNote: Unsubscribe | null = null

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.photoURL) {
                    urlToBase64(user.photoURL).then((base64) => {
                        updateProfile(new User(user.email ?? '', user.displayName ?? '', base64))
                    })
                    setAuthenticated(true)
                } else {
                    updateProfile(new User(user.email ?? '', user.displayName ?? '', null))
                }

                unsubProfile = observeProfile(() => {
                    if (onReady) onReady()
                })
                unsubTempNote = observeTempNote(() => {
                    if(noteRef.current.id.trim().length === 0) {
                        const note = getTempNote()
                        if(note) {
                            noteRef.current = note
                            oldNoteRef.current = new Note(note.author)
                            if (onNoteChanged) onNoteChanged()
                            Log('observe-temp')
                            if (headerDashboardRef) headerDashboardRef.current.update()
                        }
                    }
                })
                unsubNote = observeNote()
            } else {
                setAuthenticated(false)
                if (unsubProfile) {
                    unsubProfile()
                    unsubProfile = null
                }
                if (unsubTempNote) {
                    unsubTempNote()
                    unsubTempNote = null
                }
                if (unsubNote) {
                    unsubNote()
                    unsubNote = null
                }
            }
            if (action && loading) {
                action.style.display = 'flex'
                loading.style.display = 'none'
            }
        })

        let prevNote = new Note(getActiveProfileId())
        const interval = setInterval(() => {
            if(noteRef.current.id.trim().length === 0 && !prevNote.equals(noteRef.current)) {
                updateTempNote(noteRef.current).then(() => {
                    prevNote.set(noteRef.current)
                })
            }
        }, 60000)

        return () => {
            unsubscribe()
            if (unsubProfile) unsubProfile()
            if (unsubTempNote) unsubTempNote()
            if (unsubNote) unsubNote()
            inputBinder?.unregister()
            accountBinder?.unregister()
            clearInterval(interval)
        }
    }, [headerDashboardRef, noteRef, oldNoteRef, onReady, onNoteChanged])

    const onClick = useCallback(() => {
        fieldBinder.dispatch()
        if (menuRef.current) {
            if (window.innerWidth > 800) {
                if (menuRef.current.classList.contains(classShow)) {
                    if (onClickMenu) onClickMenu()
                    menuRef.current.classList.remove(classShow)
                }
            } else {
                if (onClickMenu) onClickMenu()
            }
        }
    }, [onClickMenu, fieldBinder])

    const onClickLogout = useCallback(() => {
        if (menuAccountRef.current) {
            menuAccountRef.current.classList.remove(classShowMenu)
        }
        if (!signOutRef.current) {
            signOutRef.current = true
            signOut(auth).finally(() => { 
                signOutRef.current = false 
                window.location.reload()
            })
        }
    }, [])

    const onClickNew = useCallback(() => {
        Log('click-new')
        fieldBinder.dispatch()
        if (noteRef.current.id.trim().length > 0) {
            const note = getTempNote()
            if (note) {
                noteRef.current = note
                oldNoteRef.current = new Note(note.author)
            } else {
                noteRef.current = new Note(getActiveProfileId())
                oldNoteRef.current = new Note(getActiveProfileId())
            }
        } else {
            const note = new Note(getActiveProfileId())
            updateTempNote(note)
            noteRef.current = note
            oldNoteRef.current = new Note(note.author)
        }
        if (onNoteChanged) onNoteChanged(true)
        if (headerDashboardRef) headerDashboardRef.current.update(true)
    }, [noteRef, oldNoteRef, headerDashboardRef, onNoteChanged, fieldBinder])

    const onClickSave = useCallback(() => {
        fieldBinder.dispatch()
        if (noteRef.current.id.trim().length === 0) {
            const note = new Note(noteRef.current.author, getCurrentTime())
            note.set(noteRef.current)
            updateNote(note).then((savedNote) => {
                noteRef.current = Note.from(savedNote)
                oldNoteRef.current = Note.from(savedNote)
                Log('click-save-1')
                if (headerDashboardRef) headerDashboardRef.current.update()
                updateTempNote(new Note(getActiveProfileId()))
            })
        } else {
            noteRef.current.dateModified = getCurrentTime()
            updateNote(noteRef.current).then((savedNote) => {
                oldNoteRef.current = Note.from(savedNote)
                Log('click-save-2')
                if (headerDashboardRef) headerDashboardRef.current.update()
            })
        }
    }, [noteRef, oldNoteRef, headerDashboardRef, fieldBinder])

    const onClickDelete = useCallback(() => {
        fieldBinder.dispatch()
        removeNote(noteRef.current.id).then(() => {
            onClickNew()
        })
    }, [noteRef, onClickNew, fieldBinder])

    return (
        <div className='header-dashboard'>
            <div className='header-dashboard-note'>
                <MenuIcon
                    containerRef={menuRef}
                    containerClassName='header-dashboard-note-container'
                    className='header-dashboard-note-container-menu'
                    onClick={onClick}
                />
                <img ref={iconRef} className='header-dashboard-note-icon' alt='' src={getLanguageIcon(noteRef.current.language)} />
                <div className='header-dashboard-note-detail'>
                    <div className='header-dashboard-note-detail-title'>
                        <div
                            ref={titleRef}
                            className='header-dashboard-note-detail-title-label ellipsis'
                            style={{ color: getLanguageColor(noteRef.current.language) }}>
                            {noteRef.current.title}
                        </div>
                        <LockIcon containerRef={lockRef} containerClassName={noteRef.current.private ? '' : 'hide'} className='header-dashboard-note-detail-title-modifier' />
                    </div>
                    <div
                        ref={authorRef}
                        className='header-dashboard-note-detail-author ellipsis'
                        style={{ color: getProfileColor(noteRef.current.author) }}>
                        {getProfileName(noteRef.current.author)}
                    </div>
                    <div ref={editRef} className='header-dashboard-note-detail-edit'>
                        <div className='header-dashboard-note-detail-edit-title'>
                            <input
                                ref={inputRef}
                                className='header-dashboard-note-detail-edit-title-input'
                                type='text'
                                spellCheck='false'
                                autoComplete='off'
                            />
                            <img ref={doneRef} className='header-dashboard-note-detail-edit-title-done' alt='' src={icDone} />
                        </div>
                        <div ref={modifierRef} className='header-dashboard-note-detail-edit-modifier'>
                            <input ref={checkRef} className='header-dashboard-note-detail-edit-modifier-check' type='checkbox' />
                            <div className='header-dashboard-note-detail-edit-modifier-label'>Private</div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={actionRef} className='header-dashboard-container'>
                {authenticated ?
                    <>
                        <Button
                            buttonRef={deleteRef}
                            label='DELETE'
                            hidden={true}
                            icon={DeleteIcon}
                            iconOnly={true}
                            onClick={onClickDelete}
                        />
                        <Button
                            buttonRef={saveRef}
                            label='SAVE'
                            hidden={!authenticated}
                            disabled={true}
                            icon={SaveIcon}
                            iconOnly={true}
                            backgroundColor='rgb(26, 188, 156)'
                            onClick={onClickSave}
                        />
                        <Button
                            label='NEW DOC'
                            icon={AddIcon}
                            iconOnlyOnMaxWidth='800px'
                            backgroundColor='#1e88e5'
                            onClick={onClickNew}
                        />
                        <Avatar
                            avatarRef={avatarRef}
                            className='header-dashboard-container-avatar'
                            username={getUser().name}
                            picture={getUser().picture}
                            width='35px'
                            height='35px'
                        />
                        <div ref={menuAccountRef} className='header-dashboard-container-menu'>
                            <div className='header-dashboard-container-menu-item' onClick={onClickLogout}>
                                <LogoutIcon className='header-dashboard-container-menu-item-icon' />
                                <div className='header-dashboard-container-menu-item-label'>Logout</div>
                            </div>
                        </div>
                    </>
                    :
                    <Button label='LOGIN' icon={LoginIcon} onClick={onClickLogin} />
                }
            </div>
            <div ref={loadingRef} className={`header-dashboard-loading ${firstRef.current ? '' : 'hide'}`}>
                <Loading className='header-dashboard-loading-icon' />
            </div>
        </div>
    )
}

export default HeaderDashboard
