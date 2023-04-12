import { Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import noImage from '../assets/Images/no-image.png'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonial({ data, role }) {
    return (
        <>
            {role == "freelancer" ?
                <Swiper
                    className="card"
                    modules={[Navigation, A11y]}
                    spaceBetween={100}
                    slidesPerView={1}
                    navigation
                >
                    {data?.map((testimonial) => <SwiperSlide key={testimonial.clientId}>
                        <img src={testimonial.clientAvatar != "no-image.png" ? `http://localhost:3001/ProfilePic/${testimonial.clientAvatar}` : noImage} alt="Client Pic" />
                        <div className="info">
                            <div className="cardHeader">
                                {testimonial.clientUsername}
                            </div>
                            <div className="cardDescription">
                                {testimonial.text}
                            </div>
                        </div>
                    </SwiperSlide>)}
                </Swiper>
                :
                <Swiper
                    className="card"
                    modules={[Navigation, A11y]}
                    spaceBetween={100}
                    slidesPerView={1}
                    navigation
                >
                    {data?.map((testimonial, i) => <SwiperSlide key={i}>
                        <img src={testimonial.freelancerAvatar != "no-image.png" ? `http://localhost:3001/ProfilePic/${testimonial.freelancerAvatar}` : noImage} alt="Client Pic" />
                        <div className="info">
                            <div className="cardHeader">
                                {testimonial.freelancerUsername}
                            </div>
                            <div className="cardDescription">
                                {testimonial.testimonialText}
                            </div>
                        </div>
                    </SwiperSlide>)}
                </Swiper>
            }
        </>

    )
}
