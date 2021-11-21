
class ButtonModel {
    show: () => void
    hide: () => void
    disabled: () => void
    enabled: () => void

    constructor(){
        this.show = () => {}
        this.hide = () => {}
        this.disabled = () => {}
        this.enabled = () => {}
    }
}

export default ButtonModel