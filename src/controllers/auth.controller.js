import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import config from '../config/temp.js';
import { generateTokens } from '../utils/generateTokens.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const isAlreadyRegistered = await User.findOne(
        { $or: [{ email }, { username }] }
    );
    if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'User already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        refreshToken: null,
        role: 'user'
    });
    res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req, res) => {
    const { email, password, username } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(401).json({ message: 'User not found' });
}
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const { accessToken, refreshToken } = await generateTokens(user, res);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message: 'Login successful', token: accessToken, role: user.role });
};

export const getMe = async (req, res) => {
    res.status(200).json({
        message: 'User fetched successfully',
        user: {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
};
export const refreshToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
        const decoded = jwt.verify(incomingRefreshToken, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
         if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const { accessToken, refreshToken } = await generateTokens(user, res);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Token refreshed successfully', token: accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};


export const changeRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        console.log('userId:', userId);
        console.log('role:', role);      


        if (!['user', 'manager', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const userToUpdate = await User.findById(userId);
                console.log('userToUpdate:', userToUpdate); 
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User to update not found' });
        }

        userToUpdate.role = role;
        await userToUpdate.save();
        res.status(200).json({ message: 'Role updated successfully' });

    } catch (error) {
         console.log('ERROR:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};