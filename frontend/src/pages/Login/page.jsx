import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authActions } from "../../store/auth.js";

const Login = () => {

    const dispatch = useDispatch();

    const history = useNavigate();
    const backendLink = useSelector((state)=>state.prod.link);
    const [Inputs, setInputs] =useState({
            userName: "",
            userEmail: "",
            userPassword: "",
        });
    
        const change = (e)=>{
            const {name,value} = e.target;
            setInputs({...Inputs, [name]: value});
        }
        const handleSubmit = async(e)=>{
            e.preventDefault();
            try
            {
                const res = await axios.post(`${backendLink}/api/auth/login`,
                    Inputs, {
                        withCredentials: true,
                    }
                );

                dispatch(authActions.login());

                history("/profile");

                //console.log(res)
                if(res.data.success)
                {
                    toast.success(res.data.message)
                }
            }
            catch(error)
            {
            //console.error(error);
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
                                    Welcome Back
                                </h2>
                                <p className="text-muted">
                                   Login to Continue!
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        value={Inputs.userEmail}
                                        name="userEmail"
                                        className="form-control" 
                                        id="floatingInput" 
                                        placeholder="Enter Your Email" 
                                        onChange={change}
                                        />
                                    <label htmlFor="floatingInput">Enter Your Email</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="password" 
                                        value={Inputs.userPassword}
                                        name="userPassword"
                                        className="form-control" 
                                        id="floatingInput" 
                                        placeholder="Enter Your Password" 
                                        onChange={change}
                                        />
                                    <label htmlFor="floatingInput">Enter Password</label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                >
                                    Login
                                </button>

                            </form>
                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">
                                    Already have an account?{" "}
                                    <Link className="text-decoration-none fw-semibold" to="/sign-up">
                                        Sign-Up
                                    </Link>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;