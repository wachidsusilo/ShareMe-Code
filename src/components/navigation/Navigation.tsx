import { LegacyRef, MutableRefObject, useCallback, useEffect, useRef } from 'react'
import NoDataAnim from '../../assets/anim/NoDataAnim'
import ArrowIcon from '../../assets/tsx/ArrowIcon'
import MenuIcon from '../../assets/tsx/MenuIcon'
import { filterNote, filterUser, setNotesCallback, setUsersCallback } from '../../firebase/database'
import { ListNoteModel, ListUserModel } from '../../model/list'
import NavigationAction from '../../model/navigation'
import Note from '../../model/note'
import ListNote from '../list/note/ListNote'
import './Navigation.scss'
import AppIcon from './../../assets/tsx/AppIcon'
import { registerBinder } from './../../utilities/binder'
import { FIELD_BINDER } from './../../constants/constant'
import ListUser from '../list/user/ListUser'
import User from '../../model/user'
import Search from './../search/Search'
import SearchModel from '../../model/search'
import { toFilterFormat } from '../../utilities/profile'
import { Log } from '../../utilities/log'

interface NavigationProps {
    navigationRef?: MutableRefObject<NavigationAction>
    onClickMenu?: () => void
    onItemSelected?: (note: Note) => void
}

const classShow = 'navigation-show'
const classShowMenu = 'navigation-header-filter-show'

function Navigation({ navigationRef, onClickMenu, onItemSelected }: NavigationProps) {
    const bodyRef: LegacyRef<HTMLDivElement> = useRef(null)
    const noDataRef: LegacyRef<HTMLDivElement> = useRef(null)
    const listNoteRef: MutableRefObject<ListNoteModel> = useRef(new ListNoteModel())
    const listUserRef: MutableRefObject<ListUserModel> = useRef(new ListUserModel())
    const filterRef: LegacyRef<HTMLDivElement> = useRef(null)
    const selectedRef: LegacyRef<HTMLDivElement> = useRef(null)
    const menuRef: LegacyRef<HTMLDivElement> = useRef(null)
    const searchRef: MutableRefObject<SearchModel> = useRef(new SearchModel())
    const queryRef: MutableRefObject<{
        userId: string,
        searchQuery: string
    }> = useRef({ userId: 'everyone', searchQuery: '' })
    const userQueryRef: MutableRefObject<{
        selected: User,
        searchQuery: string
    }> = useRef({ selected: new User('everyone', 'Everyone'), searchQuery: '' })

    useEffect(() => {
        const body = bodyRef.current
        const noData = noDataRef.current
        const selected = selectedRef.current
        const filter = filterRef.current
        const menu = menuRef.current

        if (body && noData && selected && filter && menu && navigationRef) {
            navigationRef.current.expand = () => {
                if (!body.classList.contains(classShow)) {
                    body.classList.add(classShow)
                }
            }

            navigationRef.current.collapse = () => {
                if (body.classList.contains(classShow)) {
                    body.classList.remove(classShow)
                }
            }

            const menuBinder = registerBinder(FIELD_BINDER, () => {
                if (menu.classList.contains(classShowMenu)) {
                    menu.classList.remove(classShowMenu)
                }
            })

            searchRef.current.binderWhiteList = [menuBinder.binder.id()]

            filter.onclick = () => {
                menuBinder.binder.dispatch()
                if (menu.classList.contains(classShowMenu)) {
                    menu.classList.remove(classShowMenu)
                } else {
                    menu.ontransitionend = () => {
                        menu.ontransitionend = null
                        searchRef.current.focus()
                    }
                    menu.classList.add(classShowMenu)
                }
            }

            const closeMenu = () => {
                if (!searchRef.current.hasFocus() && menu.classList.contains(classShowMenu)) {
                    menu.classList.remove(classShowMenu)
                }
            }

            const onMedia = () => {
                if (window.innerWidth < 801) {
                    navigationRef.current.collapse()
                    if (onClickMenu) onClickMenu()
                }
            }

            window.matchMedia('(max-width: 800px)').addEventListener('change', onMedia)
            window.addEventListener('keydown', closeMenu)

            setNotesCallback(() => {
                Log('notes-updated')
                const notes = filterNote(queryRef.current.searchQuery, queryRef.current.userId)
                listNoteRef.current.update(notes)
                if (notes.length > 0) {
                    noData.style.display = 'none'
                    listNoteRef.current.show()
                } else {
                    listNoteRef.current.hide()
                    noData.style.display = 'flex'
                }
            })

            setUsersCallback(() => {
                Log('users-updated')
                const users = filterUser(userQueryRef.current.searchQuery, userQueryRef.current.selected)
                listUserRef.current.update(users)
            })

            return () => {
                window.matchMedia('(max-width: 800px)').removeEventListener('change', onMedia)
                window.removeEventListener('keydown', closeMenu)
                setNotesCallback(null)
                menuBinder.unregister()
            }

        }

    }, [navigationRef, onClickMenu])

    const onClick = useCallback(() => {
        if (bodyRef.current) {
            if (bodyRef.current.classList.contains(classShow)) {
                bodyRef.current.classList.remove(classShow)
                if (onClickMenu) onClickMenu()
            }
        }
    }, [onClickMenu])

    const onUserQuery = useCallback((query: string) => {
        userQueryRef.current.searchQuery = query
        const users = filterUser(userQueryRef.current.searchQuery, userQueryRef.current.selected)
        listUserRef.current.update(users)
    }, [])

    const onNoteQuery = useCallback((query: string) => {
        queryRef.current.searchQuery = query
        const notes = filterNote(queryRef.current.searchQuery, queryRef.current.userId)
        listNoteRef.current.update(notes)
        if (notes.length > 0) {
            if (noDataRef.current) noDataRef.current.style.display = 'none'
            listNoteRef.current.show()
        } else {
            listNoteRef.current.hide()
            if (noDataRef.current) noDataRef.current.style.display = 'flex'
        }
    }, [])

    const onUserSelected = useCallback((user: User) => {
        queryRef.current.userId = user.id
        userQueryRef.current.selected = user
        if (menuRef.current && menuRef.current.classList.contains(classShowMenu)) {
            menuRef.current.ontransitionend = () => {
                if(menuRef.current) menuRef.current.ontransitionend = null
                onUserQuery(userQueryRef.current.searchQuery)
            }
            menuRef.current.classList.remove(classShowMenu)
        }
        if (selectedRef.current) selectedRef.current.innerHTML = toFilterFormat(userQueryRef.current.selected.id)
        onNoteQuery(queryRef.current.searchQuery)
    }, [onNoteQuery, onUserQuery])

    return (
        <div ref={bodyRef} className={`navigation ${(window.innerWidth > 800) ? classShow : ''}`}>
            <div className='navigation-header'>
                <AppIcon className='navigation-header-app' />
                <div className='navigation-header-filter'>
                    <div ref={filterRef} className='navigation-header-filter-container'>
                        <div ref={selectedRef} className='navigation-header-filter-container-selected ellipsis'>@everyone</div>
                        <ArrowIcon containerClassName='navigation-header-filter-container-arrow' className='navigation-header-filter-container-arrow-icon' />
                    </div>
                    <div ref={menuRef} className='navigation-header-filter-menu'>
                        <Search searchRef={searchRef} className='navigation-header-filter-menu-search' onQuery={onUserQuery} />
                        <ListUser listRef={listUserRef} onItemSelected={onUserSelected} />
                    </div>
                </div>
                <MenuIcon className='navigation-header-menu' onClick={onClick} />
            </div>
            <Search onQuery={onNoteQuery} />
            <div className='navigation-histories'>
                <ListNote listRef={listNoteRef} onItemSelected={onItemSelected} />
                <div ref={noDataRef} className='navigation-histories-no-data'>
                    <NoDataAnim />
                </div>
            </div>
        </div>
    )
}

export default Navigation
