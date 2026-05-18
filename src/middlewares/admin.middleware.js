export const admin = (req, res, next) => {
    try{
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    }
    catch(error){
        console.log('ERROR:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
