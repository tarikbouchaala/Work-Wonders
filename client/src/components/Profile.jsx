import FreelancerMenu from './FreelancerComponents/FreelancerMenu';
import noImage from '../assets/Images/no-image.png'
import { useEffect, useState } from 'react';
import ClientMenu from './ClientComponents/ClientMenu';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tokenExists, update } from '../Redux/UserSlice';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import Loading from './Loading';

export default function Profile({ type }) {
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(null)
    const { id } = useParams()
    const { token, avatar } = useSelector(state => state.user)
    const [userInfo, setUserInfo] = useState()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fullNameInput = useRef()
    const ageInput = useRef()
    const usernameInput = useRef()

    useEffect(() => {
        tokenExists(token, navigate, dispatch).then(data => (data == false || JSON.parse(localStorage.getItem('userInfo'))._id != id || window.location.href.slice(32).split('/')[0] != JSON.parse(localStorage.getItem('userInfo')).role) && navigate("/login"))
        if (localStorage.getItem('userInfo')) {
            const localStorageUserInfo = JSON.parse(localStorage.getItem('userInfo'))
            if (localStorageUserInfo.image != 'no-image.png') {
                setImage(localStorageUserInfo.image)
            }
            const userInfo = {
                fullName: localStorageUserInfo.fullName,
                age: localStorageUserInfo.age,
                username: localStorageUserInfo.username,
            }
            setUserInfo(userInfo)
        }
    }, [])

    const handleImage = (e) => {
        setImage(e.target.files[0])
    }

    const handleSave = () => {
        let err = []
        const myForm = {
            fullName: (fullNameInput.current.value).trim(),
            age: (ageInput.current.value).trim(),
            username: (usernameInput.current.value).trim(),
        }
        if (!/^[a-zA-Z\s]+$/.test(myForm.fullName)) {
            err.push('Name invalid. It must only contain letters')
        }
        if (!/^\d+$/.test(myForm.age) || parseInt(myForm.age) < 18 || parseInt(myForm.age) > 60) {
            err.push('Age invalid. It must be a number between 18 and 60');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(myForm.username)) {
            err.push('Username invalid. It must only contain letters, numbers, and underscores.');
        }
        if (typeof (image) == 'object' && image != null) {
            if (image.size > 2 * 1024 * 1024) {
                err.push('The image size should be maximum 2MB');
            }
        }

        if (err.length != 0) {
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
            const body = new FormData()
            body.append("fullName", myForm.fullName)
            body.append("age", myForm.age)
            body.append("username", myForm.username)
            if (typeof (image) == 'object' || image == null) {
                if (image == null) {
                    body.append("image", "no-image.png")
                } else {
                    body.append("image", image)
                }
            }
            setLoading(true)
            dispatch(update(body)).unwrap().then(data => {
                setTimeout(() => {
                    setLoading(false)
                    if (data.status == 200) {
                        setLoading(false)
                        localStorage.setItem('userInfo', JSON.stringify(data.updatedUserInfo))
                        window.location.reload()
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

    return (
        <>
            {loading && <Loading />}
            <div className='Profile'>
                <div className="container">
                    <div className="section">
                        <form encType="multipart/form-data" onSubmit={e => e.preventDefault()}>
                            <div className="profileHeader">
                                <div className="profiledescription">
                                    <img src={image == null || avatar === 'no-image.png' ? noImage : `http://localhost:3001/ProfilePic/${avatar}`} alt="Profile Picture" />
                                    <div className="profileName">
                                        <div className="name">
                                            {userInfo?.fullName}
                                        </div>
                                        <span>Update Your Profile Picture And Personal Details</span>
                                    </div>
                                </div>
                                <div className="profileheaderbuttons">
                                    <button onClick={e => window.location.href = `/dashboard/client/${id}/profile`}>Cancel</button>
                                    <button onClick={e => handleSave()}>Save</button>
                                </div>
                            </div>
                            <div className="profileinputs">
                                <div className="inputSection">
                                    <label htmlFor="name">Full Name</label>
                                    <input ref={fullNameInput} type="text" name="name" id="name" defaultValue={userInfo?.fullName} />
                                </div>
                                <hr />
                                <div className="inputSection">
                                    <label htmlFor="age">Age</label>
                                    <input ref={ageInput} type="text" name="age" id="age" defaultValue={userInfo?.age} />
                                </div>
                                <hr />
                                <div className="inputSection">
                                    <label htmlFor="username">Username</label>
                                    <input ref={usernameInput} type="text" name="username" id="username" defaultValue={userInfo?.username} />
                                </div>
                                <hr />
                            </div>
                            <div className="profilePicture">
                                <div className="profilePictureDescription">
                                    <div className="picturelabel">
                                        <div className="label">Your Profile Picture</div>
                                    </div>
                                    <span>This Will Be Displayed On Your Profile</span>
                                </div>
                                <img src={image == null || avatar === 'no-image.png' ? noImage : `http://localhost:3001/ProfilePic/${avatar}`} alt="Profile Picture" />
                                <div className="picturebuttons">
                                    <label htmlFor="image">Upload</label>
                                    <input onChange={e => handleImage(e)} type="file" name="image" id="image" />
                                    <button onClick={e => setImage(null)}>Delete</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {type == "1" ? <FreelancerMenu active="profile" /> : <ClientMenu active="profile" />}
                </div>
            </div>
        </>
    )
}
