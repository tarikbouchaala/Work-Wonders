import FreelancerMenu from "./FreelancerMenu";
import { HashLink } from 'react-router-hash-link';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { tokenExists } from "../../Redux/UserSlice";
import { createService } from "../../Redux/FreelancerSlice";
import Loading from './../Loading';

export default function FreelancerCreateService() {
    const { id } = useParams()
    const { token } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState()
    const gig = useRef()
    const description = useRef()
    const price = useRef()
    const image = useRef()

    useEffect(() => {
        tokenExists(token, navigate, dispatch).then(data => (data == false || JSON.parse(localStorage.getItem('userInfo')).role != "freelancer" || JSON.parse(localStorage.getItem('userInfo'))._id != id) && navigate("/login"))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        let err = []
        let myForm = {
            gig: (gig.current.value).trim(),
            description: (description.current.value).trim(),
            price: (price.current.value).trim(),
            image: image.current,
        }
        if (myForm.gig == "" && myForm.description == "" && myForm.price == "" && myForm.image.files.length == 0) {
            toast.error("Fill The Form");
        } else {
            if (!/^[a-zA-Z0-9\s\-\,\(\)]{20,}$/.test(myForm.gig)) {
                err.push('Gig invalid. It must contain letters and more than 20 caracters')
            }
            if (!/^.*[a-zA-Z]+.*$/mg.test(myForm.description) || myForm.description.length < 20) {
                err.push('Description invalid. It must contain letters and more than 20 caracters')
            }
            if (!/^\d+$/.test(myForm.price) || parseFloat(myForm.price) < 5) {
                err.push('Price Invalid. It must be a number greater or equal to 5');
            }
            if (myForm.image.files.length == 0 || myForm.image.files.length < 3 || myForm.image.files.length > 6) {
                err.push('Please select between 3 and 6 images');
            }
            else {
                let cpt = 0
                for (let i of myForm.image.files) {
                    if (i.size > (4 * 1024 * 1024)) {
                        cpt++
                    }
                }
                if (cpt != 0) {
                    err.push('Each Image Should Have Maximum Size 4MB');
                }
            }
            if (err.length != 0) {
                toast.error(
                    <div>
                        {err.map((e, i) => <p key={i}>{e}</p>)}
                    </div>);
            } else {
                setLoading(true)
                const body = new FormData()

                body.append('title', myForm.gig)
                body.append('description', myForm.description)
                body.append('price', myForm.price)
                for (let i of myForm.image.files) {
                    body.append('images', i);
                }
                dispatch(createService(body)).unwrap().then(data => {
                    setTimeout(() => {
                        setLoading(false)
                        if (data.status == 200) {
                            toast.success(data.msg)
                            navigate(`/dashboard/freelancer/${id}/services`)
                        } else if (data.status === 409) {
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
            {loading && <Loading />}
            <div className="FreelancerCreateService">
                <div className="container">
                    <div className="section">
                        <HashLink className="go-back-button" to={`/dashboard/freelancer/${id}/services`}><button>Go Back</button></HashLink>
                        <div className="createHeader">
                            Create Service
                        </div>
                        <form encType="multipart/form-data" onSubmit={e => handleSubmit(e)}>
                            <div className="form-section">
                                <label htmlFor="gig">Gig</label>
                                <input type="text" name="gig" ref={gig} placeholder="Ex:Create a WordPress Website" id="gig" />
                            </div>
                            <div className="form-section">
                                <label htmlFor="description">Description</label>
                                <textarea name="description" maxLength={1050} ref={description} id="description" placeholder="Enter Description"></textarea>
                            </div>
                            <div className="form-section">
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" ref={price} placeholder="Enter Price" id="price" />
                            </div>
                            <div className="form-section">
                                <label className="images" htmlFor="images">Select Images</label>
                                <input type="file" ref={image} name="images" multiple id="images" />
                            </div>
                            <button>Create</button>
                        </form>
                    </div>
                    <FreelancerMenu active="services" />
                </div>
            </div>
        </>

    )
}
