import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/page"
import MainLayout from "./Layout/MainLayout"
import OtherLayout from "./Layout/OtherLayout"
import Login from "./pages/Login/page"
import SignUp from "./pages/SignUp/page"
import Profile from "./pages/profile/page"
import BlogList from "./pages/BlogList/page"
import Contact from "./pages/Contact/page"
import DashboardProfile from "./components/Profile/DashboardProfile"
import Favourites from "./components/Profile/Favourites"
import LikedBlogs from "./components/Profile/LikedBlogs"
import Description from "./pages/Description/Description"
import Categories from "./pages/Categories/Categories"
import AdminLogin from "./pages/AdminLogin/AdminLogin"
import AdminDashboard from "./pages/Admin/page"
import Dashboard from "./components/AdminComponents/Dashboard/Dashboard"
import ManageCategories from "./components/AdminComponents/ManageCategories/ManageCategories.jsx"
import AddBlog from "./components/AdminComponents/AddBlog/AddBlog.jsx"
import EditBlog from "./components/AdminComponents/ManageBlogs/ManageBlogs"
import UpdateBlog from "./components/AdminComponents/ManageBlogs/Update/UpdateBlog"
import ManageAccount from "./components/Profile/ManageAccount"
import Help from "./components/Profile/Help"
import { ToastContainer } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import axios from "axios"
import { authActions } from "./store/auth.js"
//import { setUser } from "./store/user.js"


function App() {
const backendLink = useSelector((state)=>state.prod.link);
  const dispatch = useDispatch();
  //check if cookie exists
  useEffect(()=>{
    const fetch = async()=>{
      const res = await axios.get(`${backendLink}/api/auth/check-cookie`,
        {
          withCredentials: true
        }
      )
      if(res.data.message === true)
      {
        dispatch(authActions.login());
      }
    }
    
    fetch();
}, [backendLink, dispatch]);

  
  return (
    <div>

      <ToastContainer />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="/blogs" element={<BlogList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/description/:id" element={<Description />}/>
          <Route path="/categories/:id" element={<Categories />}/>

          <Route path="/profile" element={<Profile />}>
            <Route index element={<DashboardProfile />} />
            <Route path="/profile/favourites" element={<Favourites />} />
            <Route path="/profile/liked-blogs" element={<LikedBlogs />} />
            <Route path="manage-account" element={<ManageAccount />} />
            <Route path="help-section" element={<Help />} />
          </Route>

        </Route>
        
        <Route element={<OtherLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/adminLogin" element={<AdminLogin  />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="add-blog" element={<AddBlog />}/>
            <Route path="manage-categories" element={<ManageCategories />} />
            <Route path="manage-blog" element={<EditBlog />} />
            <Route path="update-blog/:id" element={<UpdateBlog />}
            />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App