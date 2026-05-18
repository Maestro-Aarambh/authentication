import User from '../models/user.model.js';

export const deleteUser = async (req, res) => {
    try {
        const user = req.user; // set by authenticate middleware

        const userIdToDelete = req.params.id;
        const userToDelete = await User.findById(userIdToDelete);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User to delete not found' });
        }

        if (user._id.toString() === userToDelete._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }

        await User.findByIdAndDelete(userIdToDelete);
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.log('ERROR:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};