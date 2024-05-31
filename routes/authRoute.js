const express = require('express');
const router = express.Router();
const { createUser, loginUserController, getallUser, getaUser, deleteaUser, updatedUser } = require("../controllers/userController"); // Ensure correct casing

// Route to register a new user
router.post('/register', createUser);
router.post("/login", loginUserController);
router.get("/all-users", getallUser);
router.get("/:id", getaUser);
router.delete("/:id", deleteaUser);
router.put("/:id", updatedUser);
module.exports = router;
