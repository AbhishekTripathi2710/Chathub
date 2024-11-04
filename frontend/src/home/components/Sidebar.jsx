import { FaSearch } from 'react-icons/fa';
import "./Sidebar.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import userConversation from './Zustans/useConversation';
import { useSocketContext } from '../../context/socketContext';
import React from 'react';

export default function Sidebar({ onSelectUser }) {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const { onlineUser, socket } = useSocketContext();

    const nowOnline = chatUser
    .filter((user) => user && user._id) // Ensure each user has a valid _id
    .map((user) => user._id);

    //chats function
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            setNewMessageUsers(newMessage)
        })
        return ()=> socket?.off("newMessage");
    },[socket,messages])


    // const talkedwith = chatUser.map((user) => (user._id));

    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/user/currentchatters`);
                if (data && data.success !== false) {
                    setChatUser(data);
                } else {
                    console.error(data?.message || "Error fetching data");
                }
            } catch (error) {
                console.error("Failed to load chat users:", error);
            } finally {
                setLoading(false);
            }
        };
        chatUserHandler();
    }, []);


    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (!data || data.success === false) { // Check if data is null or unsuccessful
                setLoading(false);
                console.log(data ? data.message : "Error fetching data");
            } else if (data.length === 0) {
                toast.info("User Not Found");
            } else {
                setSearchuser(data);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    //show which user is selected
    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);

        // Check if user and user._id exist before setting the selected user ID
        if (user && user._id) {
            setSetSelectedUserId(user._id);
        }
        setNewMessageUsers('');

    };
    //back from search results
    const handleSearchBack = () => {
        setSearchuser([]);
        setSearchInput('');
    }

    const handleLogout = async () => {
        const confirmlogout = window.prompt("type 'Username' to LOGOUT")
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                toast.info(data.message)
                localStorage.removeItem('chathub')
                setAuthUser(null)
                setLoading(false)
                navigate('login')
            } catch (error) {
                setLoading(false)
                console.log(error);

            }
        } else {
            toast.info("Logout Cancelled")
        }
    }
    return (
        <div className="sidebar-container">
            <div className="sidebar-search-bar">
                <img
                    onClick={() => authUser?._id && navigate(`/`)}
                    src={authUser?.profilepic || ''} // Safely access profilepic
                    className="sidebar-profilepic"
                    alt="profile-pic"
                />

                <form className="sidebar-search-form" onSubmit={handleSearchSubmit}>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        placeholder='Search User'
                        className="sidebar-search-input"
                    />
                    <button className="sidebar-search-button">
                        <FaSearch className="sidebar-search-icon" />
                    </button>
                </form>
            </div>
            <div className="sidebar-divider"></div>
            {searchUser?.length > 0 ? (
                <div className="sidebar-search-results">
                    {searchUser
                        .filter((user) => user?.username && user?.profilepic) // Filter out users with missing data
                        .map((user) => (
                            <div
                                key={user?._id || Math.random()}
                                className={`sidebar-user ${selectedUserId === user?._id ? 'sidebar-user-selected' : ''}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <div className={`sidebar-user-avatar ${isOnline[index] ? 'online' : ''}`}>
                                    <img src={user.profilepic} alt="user-avatar" />
                                </div>
                                <p className="sidebar-user-name">{user.username}</p>
                            </div>
                        ))}
                    <div className='revert-arrow'>
                        <button onClick={handleSearchBack}>
                            <IoArrowBackSharp size={25}></IoArrowBackSharp>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="sidebar-chat-users">
                        {chatUser.length === 0 ? (
                            <div className="sidebar-no-users">
                                <h1>Why are you Alone!!</h1>
                                <h1>Search username to chat</h1>
                            </div>
                        ) : (
                            chatUser
                                .filter((user) => user && user._id && user.username && user.profilepic)
                                .map((user, index) => (
                                    <div
                                        key={user._id || Math.random()}
                                        className={`sidebar-user ${selectedUserId === user._id ? 'sidebar-user-selected' : ''}`}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <div className={`sidebar-user-avatar ${isOnline[index] ? 'online' : ''}`}>
                                            <img src={user.profilepic} alt="user-avatar" />
                                        </div>
                                        <p className="sidebar-user-name">{user.username}</p>
                                        <div>
                                            {newMessageUsers.reciverId === authUser?._id && newMessageUsers.senderId === user._id ? (
                                                <div className="number">+1</div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))                            
                        )}
                    </div>
                    <div className="logout">
                        <button className="logout-button" onClick={handleLogout}>
                            <BiLogOut size={20} className="logout-icon" />
                        </button>
                        <span className="logout-text">Logout</span>
                    </div>
                </>
            )}

        </div>
    );
}
