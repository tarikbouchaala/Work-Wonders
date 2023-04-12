import check from '../../assets/svgs/check.svg'
import usd from '../../assets/svgs/usd.svg'
import orders from '../../assets/svgs/servicesIcon.svg'
import FreelancerMenu from './FreelancerMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokenExists } from '../../Redux/UserSlice'
import { myDashboard } from '../../Redux/FreelancerSlice'
import { toast } from 'react-toastify';
import Loading from './../Loading';
import TestimonialSlider from '../TestimonialsSlider'

export default function FreelancerDashboard() {
    const { token } = useSelector(state => state.user)
    const { data } = useSelector(state => state.freelancer)
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        tokenExists(token, navigate, dispatch).then(data => (data == false || JSON.parse(localStorage.getItem('userInfo')).role != "freelancer" || JSON.parse(localStorage.getItem('userInfo'))._id != id) && navigate("/login"))

        dispatch(myDashboard()).unwrap().then(data => {
            setTimeout(() => {
                setLoading(false)
                console.log(data)
                if (data.status == 404 || data.status == 403) {
                    toast.error(data.msg)
                    navigate('/login')
                }
                if (data.status == 505) {
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

    return (
        <>
            {loading && <Loading />}
            <div className="FreelancerDashboard">
                <div className="container">
                    <div className="section">
                        {data?.dashboard ?
                            <>
                                <div className="header">
                                    Welcome Back {data?.dashboard?.username}
                                </div>
                                <div className="stats">
                                    <div className="card">
                                        <div className="info">
                                            <div className="title">
                                                Total Revenues
                                            </div>
                                            <div className="body-stat">
                                                {data?.dashboard?.revenues} $
                                            </div>
                                        </div>
                                        <div className="logo">
                                            <img src={usd} alt="Star icon" />
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="info">
                                            <div className="title">
                                                Total Orders
                                            </div>
                                            <div className="body-stat">
                                                {data?.dashboard?.ordersNumber}
                                            </div>
                                        </div>
                                        <div className="logo">
                                            <img src={orders} alt="Star icon" />
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="info">
                                            <div className="title">
                                                Orders Completed
                                            </div>
                                            <div className="body-stat">
                                                {data?.dashboard?.completedOrders}
                                            </div>
                                        </div>
                                        <div className="logo">
                                            <img src={check} alt="Star icon" />
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="info">
                                            <div className="title">
                                                Rating
                                            </div>
                                            <div className="body-stat">
                                                {data?.dashboard?.rating == 0 ? "Not Rated Yet" : data?.dashboard?.rating}
                                            </div>
                                        </div>
                                        <div className="logo">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62">
                                                <g id="Group_380" data-name="Group 380" transform="translate(-1568 -322)">
                                                    <circle id="Oval" cx="31" cy="31" r="31" transform="translate(1568 322)" fill="#ffead7" />
                                                    <path id="star-regular" d="M36,0a1.088,1.088,0,0,1,.982.634L40.1,7.258l6.97,1.064a1.1,1.1,0,0,1,.877.76,1.152,1.152,0,0,1-.268,1.149L42.622,15.4l1.2,7.29a1.14,1.14,0,0,1-.441,1.1,1.072,1.072,0,0,1-1.15.08L36,20.437l-6.265,3.432a1.011,1.011,0,0,1-1.114-.08,1.269,1.269,0,0,1-.477-1.1l1.232-7.29L24.323,10.23a1.143,1.143,0,0,1-.269-1.149,1.1,1.1,0,0,1,.877-.76L31.9,7.258,35.016.634A1.093,1.093,0,0,1,36,0Zm0,3.7L33.611,8.777a1.113,1.113,0,0,1-.823.624l-5.379.816,3.906,3.99a1.157,1.157,0,0,1,.3.989L30.7,20.8l4.783-2.635a1.054,1.054,0,0,1,1.028,0L41.295,20.8l-.918-5.607a1.16,1.16,0,0,1,.309-.989l3.905-3.99L39.212,9.4a1.1,1.1,0,0,1-.823-.624Z" transform="translate(1563 341)" fill="#feab5e" />
                                                </g>
                                            </svg>

                                        </div>
                                    </div>
                                </div>
                                <div className="testimonials">
                                    <div className="header">
                                        Last Reviews
                                    </div>
                                    <div className="cards">
                                        {data?.dashboard?.testimonials.length != 0 ?
                                            <TestimonialSlider role="freelancer" data={data?.dashboard?.testimonials} />
                                            :
                                            <div className='noTestimonials'>You have no reviews for now</div>}
                                    </div>
                                </div>
                            </>
                            :
                            <div className="serverStopped">
                                Run the server
                            </div>
                        }
                    </div>
                    <FreelancerMenu active="home" />
                </div>
            </div>
        </>
    )
}
