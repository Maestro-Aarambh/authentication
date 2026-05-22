import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

export const validateChangeRole = [
    body('userId')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),

    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['user', 'manager', 'admin']).withMessage('Role must be user, manager or admin'),

    handleValidationErrors
];