import { useAuth } from '../../context/AuthContext';
import useConversation from './Zustans/useConversation';
import './MessageContainer.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoSend } from 'react-icons/io5';
import { useSocketContext } from '../../context/socketContext';
import notify from '../../assets/sound/notification.mp3';

export default function MessageContainer({ onbackUser }) {
    const { messages, selectedConversation, setMessage, setSelectedConversation } = useConversation();
    const { authUser } = useAuth();
    const {socket} = useSocketContext();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSendData] = useState("");

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            const sound = new Audio(notify);
            sound.play();
            setMessage([...messages,newMessage])
        })
        return ()=> socket?.off("newMessage");
    },[socket,setMessage,messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`api/message/${selectedConversation?._id}`)
                const data = await get.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.messages);
                }
                setLoading(false);
                setMessage(data);
            } catch (error) {
                setLoading(false)
                console.log(error);

            }
        }
        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessage])
    console.log(messages);

    const handleMessage = (e)=>{
        setSendData(e.target.value)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setSending(true);
        try{
            const res = await axios.post(`/api/message/send/${selectedConversation?._id}` ,{messages:sendData});
            const data = await res.data;
            if(data.success === false){
                setSending(false)
                console.log(data.message);               
            }else{
                setMessage([...messages,data])
                setSendData(""); 
            }
            setSending(false);
        } catch(error){
            setSending(false);
            console.log(error);            
        }
    }

    return (
        <div className="message-container">
            {selectedConversation === null ? (
                <div className="welcome-message">
                    <p className="welcome-username">Welcome, {authUser.username}!</p>
                    <p className="welcome-instructions">Select a chat to start messaging</p>
                </div>
            ) : (
                <>
                    <div className="conversation-view">
                        <div>
                            <button className="small-screen-button" onClick={() => onbackUser(true)}>Open Chat</button> {/* Button for small screens */}
                            <div>
                                <img src={selectedConversation?.profilepic} alt="Profile" />
                            </div>
                            <span>{selectedConversation?.username}</span>
                        </div>
                    </div>
                    <div className='message-view'>
                        {loading && (
                            <div className='spinner'></div>
                        )}
                        {!loading && messages?.length === 0 && (
                            <p>Send a message to start the Conversation</p>
                        )}
                        {!loading && messages?.length > 0 && messages?.map((message) => (
                            <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`} key={message._id}>
                                <div className="chat-content">
                                    {message?.message}
                                </div>
                                <div className="chat-timestamp">
                                    {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                                    {new Date(message?.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form className="send-message" onSubmit={handleSubmit}>
                        <div>
                            <input
                                value={sendData}
                                onChange={handleMessage}
                                required
                                id="message"
                                type="text"
                                placeholder="Type a message..."
                                disabled={sending}
                            />
                            <button type="submit" disabled={sending}>
                                {sending ? <div className="loading loading-spinner"></div> : <IoSend size={25} />}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}