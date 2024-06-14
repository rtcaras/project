const express = require('express');
const {
    createUser,
    loginUserController,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    createAdminUser,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/create-admin', createAdminUser);
router.put("/password", protect, updatePassword);
router.post('/register', createUser);
router.post('/login', loginUserController);
router.post('/forgot-password', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.get('/', protect, isAdmin, getallUser);
router.get('/:id', protect, isAdmin, getaUser);
router.put('/:id', protect, updatedUser);
router.delete('/:id', protect, isAdmin, deleteaUser);
router.put('/block/:id', protect, isAdmin, blockUser);
router.put('/unblock/:id', protect, isAdmin, unblockUser);

module.exports = router;
