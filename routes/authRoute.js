const express = require('express');
const router = express.Router();

const { createUser, 
    loginUserController,
     getallUser, 
     getaUser, 
     deleteaUser, 
     updatedUser,
     blockUser,
     unblockUser,
     handleRefeshToken,
     logout,
     } = require('../controllers/userController')
const {protect, isAdmin} = require('../middlewares/authMiddleware');

// Route to register a new user
router.post('/register', createUser);
router.post("/login", loginUserController);
router.get("/all-users", protect, getallUser);
router.get("/:id", isAdmin, getaUser);
router.get("/refresh", handleRefeshToken);
router.get("/logout", logout);
router.delete("/:id", protect, deleteaUser);
router.put("/edit-user", protect, updatedUser);
router.put("/block-user/:id", protect, isAdmin, blockUser);
router.put("/unblock-user/:id", protect, isAdmin, unblockUser);

module.exports = router;
