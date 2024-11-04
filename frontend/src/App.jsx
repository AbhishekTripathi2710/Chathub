import Login from "./login/Login"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import Register from "./register/Register";
import Home from "./home/Home";
import VerifyUser from "./utils/VerifyUser";
function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route element={<VerifyUser></VerifyUser>}>
          <Route path="/" element={<Home></Home>}></Route>
          </Route>
        </Routes>
        <ToastContainer></ToastContainer>
      </div>
    </>
  )
}

export default App
