import './ListUser.scss'
import { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { ListUserModel } from '../../../model/list'
import User from '../../../model/user'
import { Log } from '../../../utilities/log'
import { toFilterFormat } from '../../../utilities/profile'

interface ListUserProps {
    items?: Array<User>
    listRef?: MutableRefObject<ListUserModel>
    onItemSelected?: (user: User) => void
}

const getUserColor = (userId: string) => {
    if(toFilterFormat(userId) === '@me') return '#fa46a9'
    if(toFilterFormat(userId) === '@everyone') return '#41dfa2'
    return undefined
}

function ListUser({ items = [], listRef, onItemSelected }: ListUserProps) {
    const [users, setUsers] = useState<Array<User>>(items)

    useEffect(() => {
        if (listRef) {
            listRef.current.update = (newUsers: Array<User>) => {
                setUsers([...newUsers])
                Log('update-user: ' + newUsers.length)
            }
        }
    }, [listRef])

    const row = ({ index, style }: PropsWithChildren<ListChildComponentProps>) => {
        return (
            <div className='list-user-item ellipsis' style={{...style, color: getUserColor(users[index].id)}} onClick={() => {
                if (onItemSelected) onItemSelected(users[index])
            }}>{toFilterFormat(users[index].id)}</div>
        )
    }

    return (
        <div className='list-user'>
            <FixedSizeList
                height={users.length > 6 ? 150 : 25 * users.length}
                width={'100%'}
                itemCount={users.length}
                itemSize={25}
                style={{ overflowX: 'hidden' }}
            >
                {row}
            </FixedSizeList>
        </div>
    )
}

export default ListUser
