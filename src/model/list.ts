import Note from "./note"
import User from "./user"

export class ListNoteModel {
    show: () => void
    hide: () => void
    update: (notes: Array<Note>) => void

    constructor() {
        this.show = () => { }
        this.hide = () => { }
        this.update = () => { }
    }
}

export class ListUserModel {
    update: (users: Array<User>) => void

    constructor() {
        this.update = () => { }
    }
}
