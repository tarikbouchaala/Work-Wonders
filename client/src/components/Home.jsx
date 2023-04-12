import hero from '../assets/svgs/Hero.svg'
import blob from '../assets/svgs/blob.svg'
import webDeveloperService from '../assets/svgs/web developer.svg'
import webDesignService from '../assets/svgs/web design.svg'
import mobileService from '../assets/svgs/mobile developer.svg'
import aboutUs from '../assets/svgs/about us.svg'
import contactUs from '../assets/svgs/contact us.svg'
import { HashLink } from 'react-router-hash-link';
import { tokenExists } from '../Redux/UserSlice';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRef } from 'react';
import { toast } from 'react-toastify'

export default function Home() {
    const { token } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fullName = useRef()
    const email = useRef()
    const message = useRef()

    useEffect(() => {
        tokenExists(token, navigate, dispatch)
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        let err = []
        const myForm = {
            fullName: (fullName.current.value).trim(),
            email: (email.current.value).trim(),
            message: (message.current.value).trim(),
        }
        if (!/^[a-zA-Z\s]+$/.test(myForm.fullName)) {
            err.push('Full Name invalid. It must only contain letters and space')
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(myForm.email)) {
            err.push('Email invalid. It must be in the format example@example.com');
        }
        if (myForm.message.length < 10) {
            err.push('Message Should Contain More Than 10 Caracters')
        }
        if ((myForm.fullName == "" && myForm.email == "" && myForm.message.value == "") || err.length != 0) {
            if (myForm.fullName == "" && myForm.email == "" && message.current.value == "") {
                toast.error('Please Fill The Inputs')
            }
            else
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
        }
        else {
            fullName.current.value = ""
            email.current.value = ""
            message.current.value = ""
            toast.success(<p>Thank You For Contacting Us.<br /><br /> We Will Look At Your Message As Soon As Possible</p>)
        }
    }
    return (
        <div className='Home'>
            <div className="container">
                <main id='#'>
                    <div className="description" data-aos='fade-up' data-aos-delay="350" >
                        <div className='hero-description'>Top Freelancers And Services At Your Fingertips</div>
                        <p>Whether you're a business looking for support or a freelancer looking for work, we've got you covered</p>
                        <HashLink to="/signup"><button>Get Started</button></HashLink>
                    </div>
                    <div className="hero" data-aos='fade-up' data-aos-delay="350">
                        <img src={hero} className='hero-img' alt="Hero Image" />
                        <img src={blob} className='blob-img' alt="Blob Image" />
                    </div>
                </main>
                <section>
                    <div className="services" id='services'>
                        <div className="custom-headline">
                            Services
                        </div>
                        <div className="service">
                            <div className="service-headline">Web Developement</div>
                            <div className="service-description">
                                <div data-aos="fade-right" >
                                    <img src={webDeveloperService} alt="Web Developer Image" />

                                </div>
                                <div className="service-info" data-aos="fade-up">
                                    Whether you need a custom website built from scratch, an existing website redesigned, or ongoing maintenance and updates, we have the skills and experience to get the job done
                                </div>
                            </div>
                        </div>
                        <div className="service">
                            <div className="service-headline">Web Design</div>
                            <div className="service-description reverse">
                                <div data-aos="fade-up">
                                    <img src={webDesignService} alt="Web Designer Image" />
                                </div>
                                <div className="service-info" data-aos="fade-right">
                                    We offer professional web design services to help businesses and individuals create an online presence that is both visually appealing and user-friendly
                                </div>
                            </div>
                        </div>
                        <div className="service">
                            <div className="service-headline">Mobile Developement</div>
                            <div className="service-description">
                                <div data-aos="fade-right">
                                    <img src={mobileService} alt="Mobile Developer Image" />
                                </div>
                                <div className="service-info" data-aos="fade-up">
                                    If you're in need of high-quality apps for IOS
                                    and Android, our developers have the skills
                                    and expertise to make it happen.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-us" id='aboutus'>
                        <div className="custom-headline">
                            About Us
                        </div>
                        <div className="about-us-description reverse" >
                            <div data-aos="fade-up">
                                <img src={aboutUs} alt="About Us Image" />
                            </div>
                            <div className="about-us-info" data-aos="fade-right">
                                At Work Wonders, our team is dedicated to making sure that every client is completely satisfied with the work we do. Whether you're looking for a new website, marketing materials, or any other type of service, we'll work with you to understand your needs and goals, and then create a customized solution that meets your unique requirements.
                            </div>
                        </div>
                    </div>
                    <div className="contact-us" id='contactus'>
                        <div className="custom-headline">
                            Contact Us
                        </div>
                        <div className="contact-us-description reverse">
                            <div data-aos="fade-up">
                                <img src={contactUs} alt="Contact Us Image" />
                            </div>
                            <div data-aos="fade-right">
                                <form onSubmit={e => handleSubmit(e)}>
                                    <div className="form-section" >
                                        <label htmlFor="name">Full Name</label>
                                        <input type="text" ref={fullName} placeholder='John Doe' name="name" id="name" />
                                    </div>
                                    <div className="form-section">
                                        <label htmlFor="email">Email</label>
                                        <input type="text" ref={email} placeholder='johndoe@gmail.com' name="email" id="email" />
                                    </div>
                                    <div className="form-section">
                                        <label htmlFor="message">Message</label>
                                        <textarea name="message" ref={message} maxLength={255} id="message" placeholder="Enter Your Message">
                                        </textarea>
                                    </div>
                                    <button>Send</button>
                                </form>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
            <footer>
                <div className="footer-head">
                    WorkWonders
                </div>
                <p className="footer-body">
                    Work Wonders is a leading provider of freelance services, connecting talented individuals with clients who need their skills and expertise. From website design and development to writing and marketing, our team has the knowledge and experience to help you succeed.
                </p>
                <div className="footer-footer">
                    <div className="copyright">
                        Copyright Work Wonders ©2023 | All Rights Reserved
                    </div>
                    <div className="socials">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg>
                    </div>
                </div>
            </footer>
        </div>
    )
}
