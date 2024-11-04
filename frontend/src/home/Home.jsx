import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MessageContainer from "./components/MessageContainer";
import Sidebar from "./components/Sidebar";
import "./Home.css";
export default function Home() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handelUserSelect = (user) => {
        setSelectedUser(user);
        if (isSmallScreen) {
            setIsSidebarVisible(false); // Hide sidebar on small screens when a user is selected
        }
    };

    const handelShowSideBar = () => {
        setIsSidebarVisible(true);
        setSelectedUser(null);
    };

    return (
        <div className="home-container">
            <div className={`sidebar ${isSidebarVisible ? '' : 'hidden'}`}>
                <Sidebar onSelectUser={handelUserSelect}></Sidebar>
            </div>
            <div className={`message-container ${selectedUser ? '' : 'hidden'}`}>
                <MessageContainer onBackUser={handelShowSideBar}></MessageContainer>
            </div>
        </div>
    );
}