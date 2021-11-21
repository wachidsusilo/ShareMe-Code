import { getLanguageName } from "../utilities/language"
import { getProfileName } from "../utilities/profile"
import { parseFullDate } from "../utilities/time"

class Note {
    id: string
    title: string
    author: string
    content: string
    language: string
    private: boolean
    dateModified: number
    readonly dateCreated: number

    constructor(author: string = '', dateCreated?: number) {
        this.id = ''
        this.title = 'Untitled'
        this.author = author
        this.content = ''
        this.language = ''
        this.private = false
        this.dateModified = 0
        this.dateCreated = dateCreated ?? 0
    }

    set(other: Note) {
        this.id = other.id
        this.title = other.title
        this.author = other.author
        this.content = other.content
        this.language = other.language
        this.private = other.private
        this.dateModified = other.dateModified
    }

    equals(other: Note): boolean {
        return this.id === other.id
            && this.title === other.title
            && this.author === other.author
            && this.content === other.content
            && this.language === other.language
            && this.private === other.private
            && this.dateModified === other.dateModified
            && this.dateCreated === other.dateCreated
    }

    contains(query: string, ignoreCase: boolean): boolean {
        const sp = ' '
        const noteString = this.id + sp + this.title + sp + this.author + sp
            + getProfileName(this.author) + sp + this.language + sp
            + getLanguageName(this.language) + sp + parseFullDate(this.dateModified)
            + sp + parseFullDate(this.dateCreated)
        const queries = query.split(sp)
        for (let i = 0; i < queries.length; i++) {
            if(ignoreCase) {
                if (noteString.toLowerCase().indexOf(queries[i].toLowerCase()) >= 0) return true
            } else {
                if (noteString.indexOf(queries[i]) >= 0) return true
            }
        }
        return false
    }

    static from(o: object): Note {
        const obj = o as Note
        const note = new Note(obj.author, obj.dateCreated)
        note.set(obj)
        return note
    }
}

export default Note