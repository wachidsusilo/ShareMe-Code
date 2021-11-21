import './Login.scss'
import { LegacyRef, MutableRefObject, useEffect, useRef } from 'react'
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../..'
import GoogleIcon from '../../assets/tsx/GoogleIcon'
import LoginAction from '../../model/login'
import icApp from '../../assets/svg/app.svg'
import icAppName from '../../assets/svg/appname.svg'
import Loading from '../loading/Loading'
import { Log } from '../../utilities/log'

interface LoginProps {
    loginRef?: MutableRefObject<LoginAction>
}

function Login({ loginRef }: LoginProps) {
    const bodyRef: LegacyRef<HTMLDivElement> = useRef(null)
    const overlayRef: LegacyRef<HTMLDivElement> = useRef(null)
    const buttonRef: LegacyRef<HTMLDivElement> = useRef(null)
    const loadingRef: LegacyRef<HTMLDivElement> = useRef(null)

    useEffect(() => {
        const body = bodyRef.current
        const overlay = overlayRef.current
        const button = buttonRef.current
        const loading = loadingRef.current

        if (body && overlay && button && loading && loginRef) {

            const show = () => {
                body.style.height = '100%'
                body.style.transition = 'opacity 0.3s ease'
                body.style.opacity = '1'
            }

            const hide = () => {
                body.ontransitionend = () => {
                    body.ontransitionend = null;
                    body.style.transition = 'none'
                    body.style.height = '0'
                }
                body.style.opacity = '0'
            }

            button.onclick = (e) => {
                e.stopPropagation();
                button.style.display = 'none'
                loading.style.display = 'flex'
                signInWithRedirect(auth, new GoogleAuthProvider()).catch((e) => {
                    Log(e.message)
                    button.style.display = 'flex'
                    loading.style.display = 'none'
                })
            }

            overlay.onclick = (e) => {
                hide();
            }

            loginRef.current.show = show
        }
    }, [loginRef])

    return (
        <div ref={bodyRef} className='login'>
            <div className='login-card' onClick={(e) => e.stopPropagation()}>
                <div className='login-card-header'>
                    <img className='login-card-header-app-icon' alt='' src={icApp} />
                    <img className='login-card-header-app-name' alt='' src={icAppName} />
                </div>
                <div ref={buttonRef} className='login-card-button'>
                    <GoogleIcon className='login-card-button-icon' />
                    <div className='login-card-button-label'>Login with Google</div>
                </div>
                <div ref={loadingRef} className='login-card-loading'>
                    <Loading className='login-card-loading-icon' />
                </div>
            </div>
            <div ref={overlayRef} className='login-overlay' />
        </div>
    )
}

export default Login
