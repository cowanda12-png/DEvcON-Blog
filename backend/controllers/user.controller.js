import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//sign up controller
export const signUpUser = async(req,res)=>{
    try
    {
        //form validation
        console.log(req.body);
        const {userName, userEmail, userPassword, userRole} = req.body;
        

        if(!userName || !userEmail || !userPassword)
        {
            return res.status(400).json({
                success: false,
                message: "All Fields Required!"
            });
        }
        //check for existing user
        const existingUser = await User.findOne({$or: [{userName}, {userEmail}]});
        if(existingUser)
        {
            return res.status(409).json({
                success: false,
                message: "UserName or UserEmail Already exists"
            });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        //finally register user now
        const newUser = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
            userRole,
        });
        await newUser.save();

        res.status(200).json({
            success: true,
            message: `User with UserName ${userName} created!`
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: "Something went wrong while trying to register user!"
        });
        console.log(error);
    }
}

//sign in controller
export const loginUser = async(req,res)=>{
    try
    {
    const {userEmail, userPassword} = req.body;

    //form validation
    if(!userEmail || !userPassword)
    {
        return res.status(400).json({
            success: false,
            message: "Must Fill in Email and Password!"
        });
    }
    const user = await User.findOne({userEmail}).select("+userPassword");
    if(!user)
    {
        return res.status(409).json({
            success: false,
            message: "Wrong Email or Password! "
        });
    }
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if(!isMatch)
    {
        return res.status(409).json({
            success: false,
            message: "Wrong Email or Password! "
        });
    }

    //set token
    const token = jwt.sign(
        {
            id: user._id,
            userEmail: user.userEmail
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "2d" 
        }
    );
    //set cookie
    res.cookie("myCookie", token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None",
        path: "/"
    });

    res.status(201).json({
        success: true,
        message: `Welcome Back ${userEmail}` 
    });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while trying to LogIn!"
        });
    }
}

//cookie checker
export const checkCookie = (req, res)=>{
    try
    {
        const token = req.cookies.myCookie;
        if(token)
        {
            return res.status(200).json({message: true});
        }
        else
        {
            return res.status(200).json({message: false});
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

export const logoutUser = (req, res)=>{
    try
    {
        res.clearCookie("myCookie", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logged Out!"
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Error while trying to Logout!"
        });
    }
}

//get user dta
export const getProfileData =(req, res)=>{
    try
    {
        const { user } = req;
        //console.log(user)
        res.status(200).json({
            data: user
        });
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error while fetching user Data!"
        });
    }
}

//change password
export const changePassword = async (req, res) => {
    try {
        const { user } = req; 

        console.log(user);
        
        const { userPassword, newPassword, confirmPassword } = req.body;

        if (!userPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields required!"
            });
        }

        //Fetch user data again to actually check the password
        const fullUser = await User.findById(req.user._id).select("+userPassword");

        if (!fullUser) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const isCurrentCorrect = await bcrypt.compare(
            userPassword,
            fullUser.userPassword
        );

        if (!isCurrentCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect!"
            });
        }

        //to make sure the password is not being changed to just the previous one
        const isSameAsOld = await bcrypt.compare(
            newPassword,
            fullUser.userPassword
        );

        if (isSameAsOld) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as old password!"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New Password and Confirm password do not match!"
            });
        }

        fullUser.userPassword = await bcrypt.hash(newPassword, 10);

        await fullUser.save();

        res.clearCookie("myCookie", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully!"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while changing password!"
        });
    }
};

//change avatar
export const changeAvatar =async(req, res)=>{
try
{
  const {user}= req;
  if(!req.file)
  {
    return res.status(400).json({
        success: false,
        message: "No vatar Uploaded!"
    });
  }
  user.userAvatar =req.file.path;
  
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Avatar Uploaded!"
  });
}
catch
{
    return res.status(500).json({
    success: true,
    message: "Error while Uploading Avatar!"
   });
  }
}