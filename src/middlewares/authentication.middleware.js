import jwt from 'jsonwebtoken';
import config from '../config/temp.js';
import User from '../models/user.model.js';
export const authenticate = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password -refreshToken');
        req.user = user;
        next();
    }
    catch(error){
        console.log('ERROR:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};