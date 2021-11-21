import Navigation from '../../components/navigation/Navigation'
import './Dashboard.scss'
import Editor from '../../components/editor/Editor'
import Login from '../../components/login/Login'
import Note from '../../model/note'
import EditorAction from '../../model/editor'
import LoginAction from '../../model/login'
import { availableLanguages, getLanguageName, LanguageModel } from './../../utilities/language';
import { LegacyRef, MutableRefObject, useCallback, useEffect, useRef } from 'react'
import { getRedirectResult } from 'firebase/auth'
import Menu from '../../components/menu/Menu'
import MenuAction from '../../model/menu'
import HeaderDashboard from '../../components/header/dashboard/HeaderDashboard'
import { auth } from '../..'
import { HeaderDashboardAction } from '../../model/header'
import NavigationAction from '../../model/navigation'
import Overlay from '../../components/overlay/Overlay'
import OverlayAction from '../../model/overlay'
import { useBinder } from '../../utilities/binder'
import { FIELD_BINDER } from '../../constants/constant'
import { getActiveProfileId } from '../../utilities/profile'
import { detectLanguage, formatScript, setFormatState, setPostFormatCallback, setPreFormatCallback } from '../../worker/language'
import { parseDate } from '../../utilities/time'
import { getCurrentTime } from './../../utilities/time';
import { Log } from '../../utilities/log'

function Dashboard() {
    const loginRef: MutableRefObject<LoginAction> = useRef(new LoginAction())
    const editorRef: MutableRefObject<EditorAction> = useRef(new EditorAction())
    const selectLanguageRef: LegacyRef<HTMLDivElement> = useRef(null)
    const languageRef: LegacyRef<HTMLDivElement> = useRef(null)
    const formatRef: LegacyRef<HTMLDivElement> = useRef(null)
    const timeRef: LegacyRef<HTMLDivElement> = useRef(null)
    const formatStateRef: MutableRefObject<boolean> = useRef(false)
    const noteRef: MutableRefObject<Note> = useRef(new Note())
    const oldNoteRef: MutableRefObject<Note> = useRef(new Note())
    const menuRef: MutableRefObject<MenuAction> = useRef(new MenuAction())
    const headerDashboardRef: MutableRefObject<HeaderDashboardAction> = useRef(new HeaderDashboardAction())
    const navigationRef: MutableRefObject<NavigationAction> = useRef(new NavigationAction())
    const overlayRef: MutableRefObject<OverlayAction> = useRef(new OverlayAction())
    const fieldBinder = useBinder(FIELD_BINDER)

    useEffect(() => {
        const time = timeRef.current
        const format = formatRef.current
        const selectLanguage = selectLanguageRef.current

        getRedirectResult(auth).catch(e => Log(e.message))

        if (selectLanguage) {
            selectLanguage.onclick = () => {
                if (menuRef.current.shown) {
                    menuRef.current.hide()
                } else {
                    menuRef.current.show()
                }
            }
        }

        if (format) {
            setFormatState(() => {
                return formatStateRef.current
            })

            setPreFormatCallback(() => {
                formatStateRef.current = true
            })

            setPostFormatCallback((doc) => {
                formatStateRef.current = false
                if (doc) editorRef.current.updateDoc(doc)
            })

            format.onclick = () => {
                formatScript(noteRef.current.language, noteRef.current.content)
            }
        }

        const interval = setInterval(() => {
            if (time && noteRef.current.id.trim().length === 0) {
                time.innerHTML = parseDate(getCurrentTime())
            }
        }, 1000)

        return () => {
            setFormatState(null)
            setPreFormatCallback(null)
            setPostFormatCallback(null)
            clearInterval(interval)
        }

    }, [])

    const onClickLogin = useCallback(() => {
        loginRef.current.show()
    }, [])

    const onClickHeaderMenu = useCallback(() => {
        navigationRef.current.expand()
        if (window.innerWidth < 801) {
            overlayRef.current.show()
        }
    }, [])

    const onClickNavMenu = useCallback(() => {
        headerDashboardRef.current.expandMenu()
        overlayRef.current.hide()
    }, [])

    const onDocChanged = useCallback((doc: string) => {
        Log('doc-changed')
        noteRef.current.content = doc
        detectLanguage(doc).then((languageId) => {
            noteRef.current.language = languageId
            editorRef.current.updateLanguage(languageId)
            if (languageRef.current) {
                languageRef.current.innerHTML = getLanguageName(languageId)
            }
            headerDashboardRef.current.update()
        })
    }, [])

    const onNoteSelected = useCallback((note: Note) => {
        Log('note-selected: ' + note.id)
        noteRef.current = Note.from(note)
        oldNoteRef.current = Note.from(note)
        if (languageRef.current) languageRef.current.innerHTML = getLanguageName(noteRef.current.language)
        if (timeRef.current) timeRef.current.innerHTML = parseDate(noteRef.current.dateModified)
        editorRef.current.updateDoc(noteRef.current.content, false)
        editorRef.current.updateLanguage(noteRef.current.language, true)
        headerDashboardRef.current.update(true)
    }, [])

    const onNoteChanged = useCallback((newDoc) => {
        Log('note-changed: ' + (newDoc ? '[new]' : '[existing]'))
        if (languageRef.current) languageRef.current.innerHTML = getLanguageName(noteRef.current.language)
        if (timeRef.current) timeRef.current.innerHTML = parseDate(noteRef.current.dateModified)
        editorRef.current.updateDoc(noteRef.current.content, false)
        editorRef.current.updateLanguage(noteRef.current.language, true)
        if(newDoc) editorRef.current.reset()
    }, [])

    const onFocus = useCallback(() => {
        if (menuRef.current.shown) menuRef.current.hide()
        fieldBinder.dispatch()
    }, [fieldBinder])

    const onClickOverlay = useCallback(() => {
        navigationRef.current.collapse()
    }, [])

    const onItemSelected = useCallback((item: LanguageModel) => {
        Log('language-selected: ' + item.id)
        noteRef.current.language = item.id
        editorRef.current.updateLanguage(item.id)
        headerDashboardRef.current.update(true)
        if (languageRef.current) {
            languageRef.current.innerHTML = item.name
        }
    }, [])

    const onHeaderReady = useCallback(() => {
        Log('header-ready')
        noteRef.current.author = getActiveProfileId() ?? ''
        oldNoteRef.current.author = getActiveProfileId() ?? ''
        headerDashboardRef.current.update(true)
    }, [])

    return (
        <div className='dashboard'>
            <Overlay zIndex={1} overlayRef={overlayRef} onClick={onClickOverlay} />
            <Navigation navigationRef={navigationRef} onItemSelected={onNoteSelected} onClickMenu={onClickNavMenu} />
            <div className='dashboard-content'>
                <HeaderDashboard
                    noteRef={noteRef}
                    oldNoteRef={oldNoteRef}
                    headerDashboardRef={headerDashboardRef}
                    onClickLogin={onClickLogin}
                    onClickMenu={onClickHeaderMenu}
                    onReady={onHeaderReady}
                    onNoteChanged={onNoteChanged}
                />
                <div className='dashboard-content-section'>
                    <Editor actionRef={editorRef} onDocChanged={onDocChanged} onFocus={onFocus} />
                </div>
                <div className='dashboard-content-footer'>
                    <div className='dashboard-content-footer-left'>
                        <div ref={timeRef} className='dashboard-content-footer-left-timestamp'>{parseDate(getCurrentTime())}</div>
                    </div>
                    <div className='dashboard-content-footer-right'>
                        <div ref={selectLanguageRef} className='dashboard-content-footer-right-language'>
                            <div ref={languageRef}>PlainText</div>
                            <Menu
                                className='dashboard-content-footer-right-language-menu'
                                items={availableLanguages}
                                menuRef={menuRef}
                                onItemSelected={onItemSelected}
                            />
                        </div>
                        <div ref={formatRef} className='dashboard-content-footer-right-format'>Beautify</div>
                    </div>
                </div>
            </div>
            <Login loginRef={loginRef} />
        </div>
    )
}

export default Dashboard
