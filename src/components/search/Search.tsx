import './Search.scss'
import { LegacyRef, MutableRefObject, useCallback, useEffect, useRef } from 'react'
import CloseIcon from '../../assets/tsx/CloseIcon'
import SearchModel from '../../model/search'
import { useBinder } from '../../utilities/binder'
import { FIELD_BINDER } from '../../constants/constant'

interface SearchProps {
    searchRef?: MutableRefObject<SearchModel>
    className?: string
    onQuery?: (query: string) => void
}

function Search({ searchRef, className, onQuery }: SearchProps) {
    const inputRef: LegacyRef<HTMLInputElement> = useRef(null)
    const closeRef: LegacyRef<HTMLDivElement> = useRef(null)
    const focusRef: MutableRefObject<boolean> = useRef(false)
    const fieldBinder = useBinder(FIELD_BINDER)

    useEffect(() => {
        const input = inputRef.current
        const close = closeRef.current

        if (input && close) {
            input.oninput = () => {
                if (onQuery) onQuery(input.value)
                if (input.value.length > 0) {
                    if (close.classList.contains('hide')) {
                        close.classList.remove('hide')
                    }
                } else {
                    if (!close.classList.contains('hide')) {
                        close.classList.add('hide')
                    }
                }
            }

            input.onfocus = () => {
                focusRef.current = true
                if (searchRef) {
                    fieldBinder.dispatch(...searchRef.current.binderWhiteList)
                } else {
                    fieldBinder.dispatch()
                }
            }

            input.onblur = () => {
                focusRef.current = false
            }

            input.onkeydown = (e) => {
                if(e.key === 'Escape') {
                    close.click()
                    input.blur()
                    e.stopPropagation()
                }
            }

            close.onclick = () => {
                input.value = ''
                if (onQuery) onQuery('')
                if (!close.classList.contains('hide')) {
                    close.classList.add('hide')
                }
            }

            if (searchRef) {
                searchRef.current.clear = () => {
                    close.click()
                }

                searchRef.current.focus = () => {
                    input.focus()
                }

                searchRef.current.hasFocus = () => {
                    return focusRef.current
                }
            }
        }

    }, [fieldBinder, searchRef, onQuery])

    const onClickClose = useCallback(() => {

    }, [])

    return (
        <div className={`search ${className}`}>
            <div className='search-container'>
                <input
                    ref={inputRef}
                    className='search-container-input'
                    type='text'
                    spellCheck='false'
                    autoComplete='off'
                    placeholder='Search...'
                />
                <CloseIcon
                    containerRef={closeRef}
                    containerClassName='search-container-close hide'
                    className='search-container-close-icon'
                    onClick={onClickClose}
                />
            </div>
        </div>
    )
}

export default Search
