
class MenuAction {
    show: () => void
    hide: () => void
    shown: boolean

    constructor(show: () => void = () => { }, hide: () => void = () => { }) {
        this.show = show
        this.hide = hide
        this.shown = false
    }
}

export default MenuAction