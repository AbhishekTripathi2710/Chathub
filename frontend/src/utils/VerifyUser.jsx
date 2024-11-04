import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyUser() {
    const {authUser} = useAuth();
    return authUser ? <Outlet></Outlet> : <Navigate to={'/login'}></Navigate>
}