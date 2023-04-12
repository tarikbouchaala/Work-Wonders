import noImage from '../assets/Images/no-image.png'
import { useEffect, useRef, useState } from 'react';
import { conversationMessages, setNewMessages } from '../Redux/ChatSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'
import { sendMessage } from '../Redux/ChatSlice';
import io from 'socket.io-client'

export default function Message({ selectedMessage }) {
    const message = useRef()
    const chat = useRef()
    const { id } = useParams()
    const { messages } = useSelector(state => state.chat)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = useRef()
    const [arrivalMessage, setArrivalMessage] = useState(null)

    useEffect(() => {
        dispatch(conversationMessages(selectedMessage)).unwrap().then(data => {
            if (data.status == 200) {
                const newMessage = chat.current.lastElementChild;
                if (newMessage) {
                    newMessage.scrollIntoView({ behavior: "smooth" });
                }
            }
            if (data.status == 404) {
                toast.error(data.msg)
                navigate('/login')
            }
            if (data.status == 505) {
                toast.error(data.msg)
            }
        }).catch((rejectedValueOrSerializedError) => {
            toast.error(rejectedValueOrSerializedError)
        })
    }, [selectedMessage]);

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on('getMessage', (data) => {
            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now(),
                chatId: data.chatId
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && arrivalMessage.chatId == selectedMessage &&
            dispatch(setNewMessages(arrivalMessage))
    }, [arrivalMessage])

    useEffect(() => {
        socket.current.emit("addUser", id)
    }, [id])

    useEffect(() => {
        if (chat.current) {
            const newMessage = chat.current.lastElementChild;
            if (newMessage) {
                newMessage.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages])

    const sendMessageAndDisplay = () => {
        if (message.current.value.trim() != "") {
            const text = message.current.value.trim()
            socket.current.emit('sendMessage', {
                senderId: id,
                receiverId: messages.messages.withInfo._id,
                text,
                chatId: selectedMessage
            })
            dispatch(sendMessage({ receiver: messages.messages.withInfo._id, text })).unwrap().then(data => {
                if (data.status == 200) {
                    dispatch(conversationMessages(selectedMessage)).unwrap().then(data => {
                        if (data.status == 200) {
                            message.current.value = ""
                            const newMessage = chat.current.lastElementChild;
                            if (newMessage) {
                                newMessage.scrollIntoView({ behavior: "smooth" });
                            }
                        }
                        if (data.status == 404) {
                            toast.error(data.msg)
                            navigate('/login')
                        }
                        if (data.status == 505) {
                            toast.error(data.msg)
                        }
                    }).catch((rejectedValueOrSerializedError) => {
                        toast.error(rejectedValueOrSerializedError)
                    })
                }
                if (data.status == 404) {
                    toast.error(data.msg)
                    navigate('/login')
                }
                if (data.status == 505) {
                    toast.error(data.msg)
                }
            }).catch((rejectedValueOrSerializedError) => {
                toast.error(rejectedValueOrSerializedError)
            })

        }
    }

    return (
        <div className="selectedMessage">
            {
                messages?.messages?.withInfo &&
                <>
                    <div className="selectedMessageHeader">
                        <img src={messages?.messages?.withInfo?.avatar == "no-image.png" ? noImage : `http://localhost:3001/ProfilePic/${messages?.messages?.withInfo?.avatar}`} alt="image test" />
                        <span>{messages?.messages?.withInfo?.username}</span>

                    </div>
                    <div className="messageDate">
                        {moment(messages?.messages?.chatTime).format('LLL')}
                    </div>
                    <div className="chatM" ref={chat}>
                        {messages?.messages?.conversationMessages.map((message, i) =>
                            <div key={i} className={message.senderId == id ? "myMessage" : "usersMessage"}>
                                <div className={message.senderId == id ? "myMessageBody" : "usersMessageBody"}>
                                    {message.text}
                                </div>
                                <span>{moment(message.createdAt).format('LT')}</span>
                            </div>
                        )}
                    </div>
                </>
            }


            <hr />
            <div className="sendBox">
                <div className="inputbox">
                    <div className="svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                            <path id="paper-clip" d="M20.665,13.2a3.9,3.9,0,0,0-5.025,0L5.18,22.435a4.968,4.968,0,0,0,0,7.646,6.715,6.715,0,0,0,8.664,0l8.641-7.626a1.75,1.75,0,0,1,2.251,0,1.294,1.294,0,0,1,0,1.987l-8.641,7.626a10.2,10.2,0,0,1-13.166,0,7.549,7.549,0,0,1,0-11.619l10.46-9.231a7.384,7.384,0,0,1,9.528,0,5.464,5.464,0,0,1,0,8.408l-10.005,8.83a4.567,4.567,0,0,1-5.889,0,3.379,3.379,0,0,1,0-5.2l8.186-7.224a1.75,1.75,0,0,1,2.251,0,1.294,1.294,0,0,1,0,1.987L9.273,25.244a.8.8,0,0,0,0,1.224,1.08,1.08,0,0,0,1.387,0l10.005-8.83a2.883,2.883,0,0,0,0-4.435Z" transform="translate(-0.2 -9.475)" fill="rgba(112,112,112,0.5)" />
                        </svg>
                    </div>
                    <textarea ref={message} name="sendMessage" id="sendMessage" placeholder="Write Your Message Here"></textarea>
                </div>
                <button onClick={() => sendMessageAndDisplay()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                        <path id="paper-plane-regular" d="M1.093,12.7a1.574,1.574,0,0,0,.176,2.8l6.855,2.856V23.4a1.6,1.6,0,0,0,2.824,1.021l3.029-3.628,6.054,2.52a1.577,1.577,0,0,0,2.145-1.206L25.3,1.793A1.563,1.563,0,0,0,22.983.2L1.093,12.7Zm2.546,1.245L20.325,4.42,9.6,16.4l.059.049Zm16.373,6.821-8.14-3.394L22.333,5.69Z" transform="translate(-0.322 0.004)" fill="#fbfbfb" />
                    </svg>
                </button>
            </div>
        </div >
    )
}
