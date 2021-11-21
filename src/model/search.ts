
class SearchModel {
    clear: () => void
    focus: () => void
    hasFocus: () => boolean
    binderWhiteList: Array<string>

    constructor() {
        this.clear = () => { }
        this.focus = () => { }
        this.hasFocus = () => false
        this.binderWhiteList = []
    }
}

export default SearchModel