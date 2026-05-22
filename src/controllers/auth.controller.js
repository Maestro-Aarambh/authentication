import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/temp.js';
import { generateTokens } from '../utils/generateTokens.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const isAlreadyRegistered = await User.findOne(
            { $or: [{ email }, { username }] }
        );
        if (isAlreadyRegistered) {
            return res.status(400).json({ message: 'User already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword, refreshToken: null, role: 'user' });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error); //pass to error middleware
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = await generateTokens(user, res);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Login successful', token: accessToken, role: user.role });
    }  catch (error) {
        next(error); //pass to error middleware
    }
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Token refreshed successfully', token: accessToken });
    }  catch (error) {
        next(error); //pass to error middleware
    }
};

export const changeRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User to update not found' });
        }
        userToUpdate.role = role;
        await userToUpdate.save();
        res.status(200).json({ message: 'Role updated successfully' });
    }  catch (error) {
        next(error); //pass to error middleware
    }
};