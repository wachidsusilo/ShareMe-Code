import './ListNote.scss'
import Note from '../../../model/note'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { LegacyRef, MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import Avatar from '../../avatar/Avatar'
import { getLanguageIcon } from '../../../utilities/language'
import { parseDate } from '../../../utilities/time'
import LockIcon from '../../../assets/tsx/LockIcon'
import { ListNoteModel } from '../../../model/list'
import { getProfileName, getProfilePicture } from '../../../utilities/profile'
import { Log } from '../../../utilities/log'

interface ListNoteProps {
    items?: Array<Note>
    listRef?: MutableRefObject<ListNoteModel>
    onItemSelected?: (note: Note) => void
}

function ListNote({ items = [], listRef, onItemSelected }: ListNoteProps) {
    const [notes, setNotes] = useState<Array<Note>>(items)
    const bodyRef: LegacyRef<HTMLDivElement> = useRef(null)

    useEffect(() => {
        const body = bodyRef.current

        if (body && listRef) {
            listRef.current.show = () => {
                if (body.classList.contains('hide')) {
                    body.classList.remove('hide')
                }
            }

            listRef.current.hide = () => {
                if (!body.classList.contains('hide')) {
                    body.classList.add('hide')
                }
            }

            listRef.current.update = (newNotes) => {
                setNotes([...newNotes])
                Log('update-note: ' + newNotes.length)
            }
        }
    }, [listRef])

    const row = ({ index, style }: PropsWithChildren<ListChildComponentProps>) => {
        return (
            <div className='list-note-item' style={{ ...style, width: '300px' }} onClick={() => { if (onItemSelected) onItemSelected(notes[index]) }}>
                <Avatar className='list-note-item-picture' username={getProfileName(notes[index].author)} picture={getProfilePicture(notes[index].author)} width='35px' height='35px' />
                <div className='list-note-item-description'>
                    <div className='list-note-item-description-title'>
                        <div className='list-note-item-description-title-label ellipsis'>{notes[index].title}</div>
                        <LockIcon className={`list-note-item-description-title-lock ${notes[index].private ? '' : 'hide'}`} />
                    </div>
                    <div className='list-note-item-description-timestamp ellipsis'>{parseDate(notes[index].dateModified)}</div>
                </div>
                <div className='list-note-item-type'>
                    <img className='list-note-item-type-language' alt='' src={getLanguageIcon(notes[index].language)} />
                </div>
            </div>
        )
    }

    return (
        <div ref={bodyRef} className='list-note'>
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        height={height}
                        width={width}
                        itemCount={notes.length}
                        itemSize={60}
                        style={{ overflowX: 'hidden' }}
                    >
                        {row}
                    </FixedSizeList>
                )}
            </AutoSizer>
        </div>
    )
}

export default ListNote
