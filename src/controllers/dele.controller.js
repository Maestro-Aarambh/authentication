import User from '../models/user.model.js';

export const deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        //req.user comes from authentication middleware
        if (req.user._id.toString() === userToDelete._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });

    }  catch (error) {
        next(error); //pass to error middleware
    }
};