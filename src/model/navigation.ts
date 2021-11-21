
class NavigationAction {
    expand: () => void
    collapse: () => void

    constructor() {
        this.expand = () => { }
        this.collapse = () => { }
    }
}

export default NavigationAction