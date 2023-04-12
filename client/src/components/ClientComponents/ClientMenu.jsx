import home from '../../assets/svgs/homeIcon.svg'
import freelancers from '../../assets/svgs/freelancerIcon.svg'
import services from '../../assets/svgs/servicesIcon.svg'
import chat from '../../assets/svgs/chatIcon.svg'
import settings from '../../assets/svgs/settings.svg'
import { useParams } from 'react-router-dom';

export default function ClientMenu({ active }) {
    const { id } = useParams()
    return (
        <menu className='Menu'>
            <div className={active == "home" ? 'link active' : 'link'}>
                <a href={`/dashboard/client/${id}`}>
                    <img src={home} alt="Home" />
                    <div className="linkHeader">
                        Home
                    </div>
                </a>
            </div>
            <div className={active == "freelancers" ? 'link active' : 'link'}>
                <a href={`/dashboard/client/${id}/services`}>
                    <img src={freelancers} alt="Freelancers" />
                    <div className="linkHeader">
                        Freelancers
                    </div>
                </a>
            </div>
            <div className={active == "orders" ? 'link active' : 'link'}>
                <a href={`/dashboard/client/${id}/orders`}>
                    <img src={services} alt="Orders" />
                    <div className="linkHeader">
                        My Orders
                    </div>
                </a>
            </div>
            <div className={active == "chat" ? 'link active' : 'link'}>
                <a href={`/dashboard/client/${id}/chat`}>
                    <img src={chat} alt="Chat" />
                    <div className="linkHeader">
                        Chat Room
                    </div>
                </a>
            </div>
            <div className={active == "profile" ? 'link active' : 'link'}>
                <a href={`/dashboard/client/${id}/profile`}>
                    <img src={settings} alt="Settings" />
                    <div className="linkHeader">
                        My Profile
                    </div>
                </a>
            </div>
        </menu>
    )
}
