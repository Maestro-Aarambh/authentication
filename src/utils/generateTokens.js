import jwt from 'jsonwebtoken';
import config from '../config/temp.js';

export const generateTokens = async (user, res) => {
    const accessToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return {
        accessToken,
        refreshToken
    };
};
