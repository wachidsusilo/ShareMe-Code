
class User {
    id: string
    name: string
    picture: string | null

    constructor(id: string = '', name: string = '', picture: string | null = null) {
        this.id = id
        this.name = name
        this.picture = picture
    }

    contains(query: string, ignoreCase: boolean) {
        if(ignoreCase) {
            return this.id.toLowerCase().indexOf(query.toLowerCase()) >= 0 || this.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
        } else {
            return this.id.indexOf(query) >= 0 || this.name.indexOf(query) >= 0
        }
    }

    static from(other: User) {
        return new User(other.id, other.name, other.picture)
    }
}

export default User