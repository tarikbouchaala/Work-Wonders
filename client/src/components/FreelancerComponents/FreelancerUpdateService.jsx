import FreelancerMenu from "./FreelancerMenu";
import { HashLink } from 'react-router-hash-link';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { tokenExists } from "../../Redux/UserSlice";
import { useEffect, useState } from "react";
import { showService, updateService } from "../../Redux/FreelancerSlice";
import Loading from './../Loading';
import { toast } from 'react-toastify';

export default function FreelancerUpdateService() {
    const { id, serviceId } = useParams()
    const { token } = useSelector(state => state.user)
    const { data } = useSelector(state => state.freelancer)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [gig, setGig] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState({ length: 0 })

    useEffect(() => {
        tokenExists(token, navigate, dispatch).then(data => (data == false || JSON.parse(localStorage.getItem('userInfo')).role != "freelancer" || JSON.parse(localStorage.getItem('userInfo'))._id != id) && navigate("/login"))
    }, [])

    useEffect(() => {
        dispatch(showService(serviceId)).unwrap().then(data => {
            setTimeout(() => {
                setLoading(false)
                if (data.status == 200) {
                    setGig(data.selectedService.title)
                    setDescription(data.selectedService.description)
                    setPrice(data.selectedService.price)
                }
                else if (data.status == 404) {
                    navigate('/404')
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
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        let err = []
        let myForm = {
            gig: gig.trim(),
            description: description.trim(),
            price: price,
            image: image,
        }
        if (myForm.gig == "" && myForm.description == "" && myForm.price == "" && myForm.image.length == 0) {
            toast.error("Fill The Form");
        } else {
            if (!/^[a-zA-Z0-9\s\-\,\(\)]{20,}$/.test(myForm.gig)) {
                err.push('Gig invalid. It must contain letters and more than 20 caracters')
            }
            if (!/^.*[a-zA-Z]+.*$/mg.test(myForm.description) || myForm.description.length < 20) {
                err.push('Description invalid. It must contain letters and more than 20 caracters')
            }
            if (isNaN(parseFloat(myForm.price)) || parseFloat(myForm.price) < 5) {
                err.push('Price Invalid. It must be a number greater or equal to 5');
            }
            if (myForm.image.length == 0 || myForm.image.length < 3 || myForm.image.length > 6) {
                err.push('Please select between 3 and 6 images');
            }
            else {
                let cpt = 0
                for (let i of myForm.image) {
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
                for (let i of myForm.image) {
                    body.append('images', i);
                }
                dispatch(updateService({ serviceId, body })).unwrap().then(data => {
                    setTimeout(() => {
                        setLoading(false)
                        if (data.status == 200) {
                            toast.success(data.msg)
                            navigate(`/dashboard/freelancer/${id}/services/manage`)
                        } else if (data.status === 409) {
                            toast.info(data.msg)
                        } else if (data.status === 403 || data.status === 404) {
                            toast.info(data.msg)
                            navigate('/login')
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
            <div className="FreelancerUpdateService">
                <div className="container">
                    <div className="section">
                        <HashLink className="go-back-button" to={`/dashboard/freelancer/${id}/services/manage`}><button>Go Back</button></HashLink>
                        <div className="updateHeader">
                            Update Service
                        </div>
                        <form encType="multipart/form-data" onSubmit={e => handleSubmit(e)}>
                            <div className="form-section">
                                <label htmlFor="gig">Gig</label>
                                <input type="text" name="gig" placeholder="Ex:Create a WordPress Website" onChange={e => setGig(e.target.value)} value={gig} id="gig" />
                            </div>
                            <div className="form-section">
                                <label htmlFor="description">Description</label>
                                <textarea name="description" maxLength={1050} id="description" onChange={e => setDescription(e.target.value)} value={description} placeholder="Enter Description"></textarea>
                            </div>
                            <div className="form-section">
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" placeholder="256" onChange={e => setPrice(e.target.value)} value={price} id="price" />
                            </div>
                            <div className="form-section">
                                <label className="images" htmlFor="images">Select Images</label>
                                <input type="file" onChange={e => setImage(e.target.files)} name="images" multiple id="images" />
                            </div>
                            <button>Update</button>
                        </form>
                    </div>
                    <FreelancerMenu active="services" />
                </div>
            </div>
        </>
    )
}
