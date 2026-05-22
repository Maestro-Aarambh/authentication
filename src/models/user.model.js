import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: {
        type: String,  
        required:[true,"Username is required"]
    },
    email: {
        type: String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"]
    },
    password: {
        type: String,
        required:[true,"Password is required"]
    },
    refreshToken: {
        type: String
    },
    role: { type: String, 
        enum: ['user', 'admin', 'manager'], 
        default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String }
});
const User= mongoose.model('User',userSchema);
export default User;
