
class EditorAction {
    updateLanguage: (lang: string, forceUpdate?: boolean) => void
    updateDoc: (doc: string, notify?: boolean) => void
    reset: () => void

    constructor() {
        this.updateLanguage = () => { }
        this.updateDoc = () => { }
        this.reset = () => { }
    }
}

export default EditorAction