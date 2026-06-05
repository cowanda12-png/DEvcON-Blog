import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {

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
        const res = await axios.post(`${backendLink}/api/auth/sign-up`,
            Inputs,
            {
                withCredentials: true
            }
        );
        
        console.log(res)
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
                                    Create Account
                                </h2>
                                <p className="text-muted">
                                    Join us today and start your journey
                                </p>
                            </div>
                            <form action="" onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        value={Inputs.userName}
                                        name="userName"
                                        className="form-control" 
                                        id="floatingInput" 
                                        placeholder="Enter Your Name" 
                                        onChange={change}
                                        />
                                    <label htmlFor="floatingInput">Register Your Name</label>
                                </div>
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
                                    <label htmlFor="floatingInput">Register Your Email</label>
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
                                    <label htmlFor="floatingInput">Register Password</label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                >
                                    Sign Up
                                </button>

                            </form>
                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">
                                    Already have an account?{" "}
                                    <Link className="text-decoration-none fw-semibold" to="/login">
                                        Login
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

export default SignUp;