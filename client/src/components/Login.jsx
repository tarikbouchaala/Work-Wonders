import SpecialFooter from "./SpecialFooter";
import signin from '../assets/svgs/signin.svg'
import { useRef, useState } from "react";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { login, setAvatar, setToken, setUserId, tokenExists, setUserRole } from "../Redux/UserSlice";
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import { useEffect } from "react";

export default function Login() {
    const username = useRef()
    const password = useRef()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        tokenExists(token, navigate, dispatch).then(() => {
            if (localStorage.getItem('userInfo')) {
                const connectedUser = JSON.parse(localStorage.getItem('userInfo'))
                if (connectedUser.role == "client") {
                    navigate(`/dashboard/client/${connectedUser._id}`)
                } else {
                    navigate(`/dashboard/freelancer/${connectedUser._id}`)
                }
            }
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        let err = []
        if (!/^[a-zA-Z0-9_]+$/.test(username.current.value)) {
            err.push('Username invalid. It must only contain letters, numbers, and underscores')
        }
        if (password.current.value.length < 8) {
            err.push('Password invalid. It must be more than 8 caracters')
        }
        if (err.length !== 0) {
            toast.error(
                <div>
                    <p>{err[0]}</p>
                    <p>{err[1]}</p>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
        } else {
            setLoading(true)
            const body = { username: username.current.value, password: password.current.value }
            dispatch(login(body)).unwrap().then(data => {
                setTimeout(() => {
                    setLoading(false)
                    if (data.status == 200) {
                        toast.success(data.msg)
                        localStorage.setItem('token', data.token)
                        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

                        dispatch(setUserId(data.userInfo._id))
                        dispatch(setToken(data.token))
                        dispatch(setAvatar(data.userInfo.image))
                        dispatch(setUserRole(data.userInfo.role))

                        if (data.userInfo.role == "client") {
                            navigate(`/dashboard/client/${data.userInfo._id}`)
                        } else {
                            navigate(`/dashboard/freelancer/${data.userInfo._id}`)
                        }
                    }
                    else {
                        toast.error(data.msg)
                    }
                }, 1000);
            }).catch((rejectedValueOrSerializedError) => {
                setTimeout(() => {
                    setLoading(false)
                    toast.error(rejectedValueOrSerializedError)
                }, 1000);
            })
        }
    }
    return (
        <>
            {loading && <Loading />}
            <div className="Login" >
                <div className="container">
                    <section>
                        <img src={signin} alt="Sign In Image" />
                        <div className="loginForm">
                            <div className="loginHeader">
                                Welcome Back
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-section">
                                    <label htmlFor="username">Username</label>
                                    <input ref={username} type="text" placeholder="Enter Your Username" name="username" id="username" />
                                </div>
                                <div className="form-section">
                                    <label htmlFor="password">Password</label>
                                    <input ref={password} type="password" placeholder="Enter Your Password" name="password" id="password" />
                                </div>
                                <button>Sign In</button>
                            </form>
                            <div className="signupSection">
                                <span>Not a member ?</span> <a href="/signup"><button>Sign Up</button></a>
                            </div>
                        </div>
                    </section>
                </div>
                <SpecialFooter />
            </div>
        </>
    )
}
