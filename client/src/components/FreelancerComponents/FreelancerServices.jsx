import FreelancerMenu from './FreelancerMenu'
import Slider from './../Slider';
import noImage from '../../assets/Images/no-image.png'
import { HashLink } from 'react-router-hash-link';
import { tokenExists } from "../../Redux/UserSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { myServices } from "../../Redux/FreelancerSlice";
import { toast } from 'react-toastify';
import Loading from './../Loading';

export default function FreelancerServices() {
  const { token, avatar } = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const { data } = useSelector(state => state.freelancer)
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    tokenExists(token, navigate, dispatch).then(data => (data == false || JSON.parse(localStorage.getItem('userInfo')).role != "freelancer" || JSON.parse(localStorage.getItem('userInfo'))._id != id) && navigate("/login"))
  }, [])

  useEffect(() => {
    dispatch(myServices()).unwrap().then(data => {
      setTimeout(() => {
        setLoading(false)
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
      <div className='FreelancerServices'>
        <div className="container">
          <div className="section">
            <div className="buttons">
              <HashLink to={`/dashboard/freelancer/${id}/services/create`}><button>Create Service</button></HashLink>
              <HashLink to={`/dashboard/freelancer/${id}/services/manage`}><button>Manage Services</button></HashLink>
            </div>
            <div className="services">
              {data?.allServices && data.allServices.length != 0 ? data.allServices.map(service => <div key={service._id} className="service">
                <div className="slider">
                  <Slider images={service.images.split('|')} />
                </div>
                <div className="serviceHeader">
                  <img src={avatar === 'no-image.png' ? noImage : `http://localhost:3001/ProfilePic/${avatar}`} alt="Service" />
                  <span>{localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).username}</span>
                </div>
                <div className="serviceBody">
                  <p className="serviceTitle">
                    {service.title.length > 19 ? `${service.title.slice(0, 19)}...` : service.title}
                  </p>
                  <p className="serviceDescription">
                    {service.description.length > 100 ? `${service.description.slice(0, 100)}...` : service.description}
                  </p>
                  <div className="rating-more">
                    <div className="rating">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg>
                      <span>{service.serviceRating != 0 ? service.serviceRating : "Not Rated"}</span>
                    </div>
                    <HashLink to={`/dashboard/freelancer/${service.userId}/services/show/${service._id}`}> <button>See More</button></HashLink>
                  </div>
                </div>
                <hr />
                <div className="servicePrice">
                  Price: {service.price} $
                </div>
              </div>) : <div className='noServices'>No Service for the moment</div>}
            </div>
          </div>
          <FreelancerMenu active="services" />
        </div>
      </div>
    </>

  )
}
