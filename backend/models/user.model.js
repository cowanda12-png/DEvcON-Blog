import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        required: true,
        select: false, 
    },
    userRole: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user",
        
    },
    userAvatar: {
        type: String
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;