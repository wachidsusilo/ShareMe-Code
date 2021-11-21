
class LoginAction {
    show: () => void

    constructor(show: () => void = () => {}) {
        this.show = show
    }
}

export default LoginAction