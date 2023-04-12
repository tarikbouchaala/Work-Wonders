import SpecialFooter from "./SpecialFooter";
import signup from '../assets/svgs/signup.svg'
import { useRef } from 'react';
import { toast } from 'react-toastify'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, tokenExists } from "../Redux/UserSlice";
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";


export default function Signup() {
    const name = useRef()
    const age = useRef()
    const email = useRef()
    const username = useRef()
    const password = useRef()
    const passwordConfirmation = useRef()
    const role = useRef()
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector(state => state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    const handleImage = (e) => {
        setImage(e.target.files[0])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let err = []
        let myForm = {
            name: (name.current.value).trim(),
            age: age.current.value,
            email: (email.current.value).trim(),
            username: (username.current.value).trim(),
            password: password.current.value,
            passwordConfirmation: passwordConfirmation.current.value,
            role: role.current.value
        }
        if (myForm.name == "" && myForm.age == "" && myForm.email == "" && myForm.username == "" && myForm.password == "" && myForm.passwordConfirmation == "" && myForm.role == "") {
            toast.error("Fill The Form");
        }
        else {
            if (!/^[a-zA-Z\s]+$/.test(myForm.name)) {
                err.push('Name invalid. It must only contain letters')
            }

            if (!/^\d+$/.test(myForm.age) || parseInt(myForm.age) < 18 || parseInt(myForm.age) > 60) {
                err.push('Age invalid. It must be a number between 18 and 60');
            }

            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(myForm.email)) {
                err.push('Email invalid. It must be in the format example@example.com');
            }

            if (!/^[a-zA-Z0-9_]+$/.test(myForm.username)) {
                err.push('Username invalid. It must only contain letters, numbers, and underscores.');
            }

            if (myForm.password.length < 8) {
                err.push('Password invalid. It must be more than 8 characters.');
            }

            if (myForm.password !== myForm.passwordConfirmation) {
                err.push('Password confirmation does not match the password.');
            }

            if (myForm.role === "") {
                err.push('Please select your account type.');
            }
            if (err.length !== 0) {
                toast.error(
                    <div>
                        {err.map((e, i) => <p key={i}>{e}</p>)}
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
                const body = new FormData()
                body.append('fullName', myForm.name)
                body.append('age', myForm.age)
                body.append('email', myForm.email)
                body.append('username', myForm.username)
                body.append('password', myForm.password)
                body.append('role', myForm.role)
                if (image) {
                    body.append('image', image)
                }

                dispatch(signUp(body)).unwrap().then(data => {
                    setTimeout(() => {
                        setLoading(false)
                        if (data.status == 200) {
                            setLoading(false)
                            toast.success(data.msg)
                            navigate('/login')
                        } else if (data.status === 403) {
                            toast.info(data.msg)
                        } else {
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


    }

    return (
        <>
            {loading == true && <Loading />}
            <div className="Signup">
                <div className="container">
                    <section>
                        <img src={signup} alt="Sign In Image" />
                        <div className="signupForm">
                            <div className="signupHeader">
                                Create an account
                            </div>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="inputs">
                                    <div className="formsplitsections">
                                        <div className="form-section">
                                            <label htmlFor="name">Full Name</label>
                                            <input ref={name} type="text" placeholder="Enter Your Full Name" name="name" id="name" />
                                        </div>
                                        <div className="form-section">
                                            <label htmlFor="age">Age</label>
                                            <input ref={age} type="text" placeholder="Enter Your Age" name="age" id="age" />
                                        </div>
                                        <div className="form-section">
                                            <label htmlFor="email">Email</label>
                                            <input ref={email} type="text" placeholder="Enter Your Email" name="email" id="email" />
                                        </div>
                                        <div className="form-section">
                                            <label htmlFor="username">Username</label>
                                            <input ref={username} type="text" placeholder="Enter Your Username" name="username" id="username" />
                                        </div>
                                    </div>
                                    <div className="formsplitsections">
                                        <div className="form-section">
                                            <label htmlFor="password">Password</label>
                                            <input ref={password} type="password" placeholder="Enter Your Password" name="password" id="password" />
                                        </div>
                                        <div className="form-section">
                                            <label htmlFor="passwordConfirmation">Confirm Password</label>
                                            <input ref={passwordConfirmation} type="password" placeholder="Enter Your Password Confirmation" name="passwordConfirmation" id="passwordConfirmation" />
                                        </div>
                                        <div className="form-section">
                                            <label htmlFor="password">Register As</label>
                                            <select ref={role} name="role" id="role">
                                                <option value="">Choose An Option</option>
                                                <option value="freelancer">Freelancer</option>
                                                <option value="client">Client</option>
                                            </select>
                                        </div>
                                        <div className="form-section">
                                            <label className="image" htmlFor="image">Select Profile Picture</label>
                                            <input onChange={e => handleImage(e)} type="file" name="image" id="image" />
                                        </div>
                                    </div>
                                </div>
                                <button>Sign Up</button>
                            </form>
                            <div className="signupSection">
                                <span>Already Registered ?</span> <a href="/login"><button>Sign In</button></a>
                            </div>
                        </div>
                    </section>
                </div>
                <SpecialFooter />
            </div>
        </>
    )
}