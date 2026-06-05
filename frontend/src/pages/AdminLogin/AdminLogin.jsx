import { useState } from "react";
import axios from "axios"; 
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

    const redirect = useNavigate();
    
    const backendUrl = useSelector((state)=>state.prod.link);

    const [Inputs, setInputs] =useState({
                userEmail: "",
                userPassword: "",
            });
        
            const change = (e)=>{
                const {name,value} = e.target;
                setInputs({...Inputs, [name]: value});
            }
    
            const handleAdminLogin = async(e)=>{
                e.preventDefault();
                try 
                {
                    const res = await axios.post(`${backendUrl}/api/admin/admin-login`,
                        Inputs, {
                            withCredentials: true
                        }
                    );

                    if(res.data.success)
                    {
                        toast.success(res.data.message)
                    }
                    redirect("/admin-dashboard");
                } catch (error) 
                {
                    if (error.response && error.response.data) {
                        if (error.response.data.success === false) {
                            toast.error(error.response.data.message);
                        }
                        
                    } else {
                        toast.error("Server is unreachable. Please try again later!");
                    }
                }
            }
    return ( 
        <div className="container py-5">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">
                                    Welcome Admin
                                </h2>
                                <p className="text-muted">
                                   Login to Continue!
                                </p>
                            </div>
                            <form onSubmit={handleAdminLogin}>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        value={Inputs.userEmail}
                                        name="userEmail"
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="Enter Your Email" 
                                        onChange={change}
                                        />
                                    <label for="floatingInput">Enter Your Email</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="password" 
                                        value={Inputs.userPassword}
                                        name="userPassword"
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="Enter Your Password" 
                                        onChange={change}
                                        />
                                    <label for="floatingInput">Enter Password</label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                >
                                    Login
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default AdminLogin;