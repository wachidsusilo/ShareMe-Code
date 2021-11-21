
export class HeaderDashboardAction {
    update: (forceUpdate?: boolean) => void
    collapseMenu: () => void
    expandMenu: () => void
    collapseAccountMenu: () => void

    constructor() {
        this.update = () => {}
        this.collapseMenu = () => {}
        this.expandMenu = () => {}
        this.collapseAccountMenu = () => {}
    }
}