import jwt from 'jsonwebtoken';
import config from '../config/temp.js';
import User from '../models/user.model.js';

export const deleteUser = async (req, res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        console.log('requesting user:', user?.username); 
        console.log('target id:', req.params.id);        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const userIdToDelete = req.params.id;
        const userToDelete = await User.findById(userIdToDelete);
        console.log('user to delete:', userToDelete?.username);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User to delete not found' });
        }
        if (user._id.toString() === userToDelete._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }
        await User.findByIdAndDelete(userIdToDelete);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch(error){
        console.log('ERROR:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};