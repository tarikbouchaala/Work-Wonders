import ClientMenu from "./ClientMenu";
import { HashLink } from 'react-router-hash-link';
import noImage from '../../assets/Images/no-image.png'
import Slider from './../Slider';
import { useEffect } from 'react';
import { getOrders } from './../../Redux/ClientSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { tokenExists } from './../../Redux/UserSlice';
import { toast } from 'react-toastify';
import Loading from './../Loading';
import { HiOutlineXCircle } from 'react-icons/hi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { MdOutlineFilterAltOff } from 'react-icons/md';





export default function ClientOrders() {
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("All")
    const [newdata, setNewData] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.user)
    const { data } = useSelector(state => state.client)

    useEffect(() => {
        tokenExists(token, navigate, dispatch).then(data => (data == false || JSON.parse(localStorage.getItem('userInfo')).role != "client" || JSON.parse(localStorage.getItem('userInfo'))._id != id) && navigate("/login"))
    }, [])

    useEffect(() => {
        dispatch(getOrders()).unwrap().then(data => {
            setTimeout(() => {
                setLoading(false)
                if (data.status == 200) {
                    setNewData(data.clientOrders)
                }
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

    useEffect(() => {
        if (data?.clientOrders) {
            if (filter == "All") {
                setNewData(data.clientOrders)
            } else {
                const filteredData = data.clientOrders.filter(order => order.status == filter)
                setNewData(filteredData)
            }
        }
    }, [filter, data])

    return (
        <>
            {loading && <Loading />}
            <div className="ClientOrders">
                <div className="container">
                    <div className="section">
                        <div className="orders-header">
                            My Orders
                        </div>
                        <div className="filterOrders">
                            <div className={filter == "All" ? "filter all active" : "filter all"} onClick={e => setFilter("All")}>
                                <MdOutlineFilterAltOff /> All
                            </div>
                            <div className={filter == "OnGoing" ? "filter ongoing active" : "filter ongoing"} onClick={e => setFilter("OnGoing")}>
                                <AiOutlinePlayCircle /> Ongoing
                            </div>
                            <div className={filter == "Completed" ? "filter completed active" : "filter completed"} onClick={e => setFilter("Completed")}>
                                <AiOutlineCheckCircle /> Completed
                            </div>
                            <div className={filter == "Cancelled" ? "filter cancelled active" : "filter cancelled"} onClick={e => setFilter("Cancelled")}>
                                <HiOutlineXCircle /> Cancelled
                            </div>
                        </div>
                        <div className="services">
                            {
                                newdata && newdata.length != 0 ? newdata.map(order =>

                                    <div key={order._id} className="service">
                                        <div className="slider">
                                            <Slider images={order.serviceInfo.images.split('|')} />
                                        </div>
                                        <div className="serviceHeader">
                                            <img src={order.serviceUserInfo.image === 'no-image.png' ? noImage : `http://localhost:3001/ProfilePic/${order.serviceUserInfo.image}`} alt="" />
                                            <span>{order.serviceUserInfo.username}</span>
                                        </div>
                                        <div className="serviceBody">
                                            <p className="serviceTitle">
                                                {order.serviceInfo.title.length > 19 ? `${order.serviceInfo.title.slice(0, 19)}...` : order.serviceInfo.title}
                                            </p>
                                            <p className="serviceDescription">
                                                {order.serviceInfo.description.length > 100 ? `${order.serviceInfo.description.slice(0, 100)}...` : order.serviceInfo.description}
                                            </p>
                                            <div className="rating-more">
                                                <div className="rating">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                                    </svg>
                                                    <span>{order.serviceRating !== 0 ? order.serviceRating : "Not Rated"}</span>
                                                </div>
                                                <HashLink to={`/dashboard/client/${id}/order/show/${order._id}`}> <button>See More</button></HashLink>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="servicePrice">
                                            Price: {order.serviceInfo.price} $
                                        </div>
                                        <hr />
                                        <div className="serviceState">
                                            State: {order.status == "OnGoing" ? <span className="ongoing">OnGoing</span> : order.status == "Cancelled" ? <span className="cancelled">Cancelled</span> : <span className="completed">Completed</span>}
                                        </div>
                                    </div>)
                                    :
                                    <div className='noServices'>You Didn't Made An Order Yet</div>
                            }
                        </div>
                    </div>
                    <ClientMenu active="orders" />
                </div>
            </div>
        </>
    )
}
