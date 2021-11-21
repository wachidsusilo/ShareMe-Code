import { auth } from "..";
import User from "../model/user";

export const getUser = (): User => {
    const user = auth.currentUser
    if(user) return new User(user.email ?? '', user.displayName ?? 'User', user.photoURL)
    return new User('', 'User', null)
}