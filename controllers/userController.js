const { generateToken } = require('../config/jwtoken');
const User = require('../models/usermodel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");
const { generateRefreshToken } = require('../config/refreshtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require("jsonwebtoken");

const createUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, mobile } = req.body;

    // Check for missing fields
    if (!firstname || !lastname || !email || !password || !mobile) {
        return res.status(400).json({ message: 'Firstname, Lastname, Email, Password, and Mobile are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    try {
        const user = new User({ firstname, lastname, email, password, mobile });
        await user.save();

        res.status(201).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Login a user

const loginUserController = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

   // check if user exist or not
   const findUser = await User.findOne({ email });
if (findUser && await findUser.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findUser._id);
    const updatedUser = await User.findByIdAndUpdate(
        findUser.id, 
        {
        refreshToken: refreshToken,
    },
    {new: true}
);
res.cookie("refreshToke", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
});
res.json({
    _id: findUser._id,
    firstname: findUser.firstname,
    lastname: findUser.lastname,
    email: findUser.email,
    mobile: findUser.mobile,
    token: generateToken(findUser._id),
});
} else  {
    res.status(401);
    throw new Error("Invalid Credentials");
}
    });

    //Handle refresh token
    const handleRefeshToken = asyncHandler(async(req, res) =>{
        const cookie = req.cookies;
        console.log(cookie);
        if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
        const refreshtoken = cookie.refreshToken;
        console.log(refreshToken);
        const user = await User.findOne({ refreshToken });
        if(!user) throw new Error ("No Refresh Token present in DB or not matched");
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
if (err || user.id !==decoded.id){
    throw new Error("There is something wrong with refresh token");
} 
const acessToken = generateToken(user._id)
res.json(accessToken);
        });
    });

    //Logout function
const logout = asyncHandler(async(req, res) => {
const cookie = req.cookies;
if (!cookie.refreshToken) throw new Error("No refresh token in cookies");
const refreshToken = cookie.refreshToken;
const user = await User.findOne({refreshToken});
if(!user) {
   res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
   });
   return res.sendStatus(204); // forbidden
}
await User.findOneAndUpdate(refreshToken, {
   refreshToken: "",
});
res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
});
 res.sendStatus(204);  // forbidden
});

    //Update a user

    const updatedUser = asyncHandler(async(req, res) =>{
        const {_id} = req.user;
        validateMongoDbId(-id);
        try {
const updatedUser = await User.findByIdAndUpdate(
    id, 
    {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    mobile: req.body.mobile,
},
{
    new: true,
}
);
res.json(updatedUser);
        }catch (error) {
throw new Error(error);
        }
    })

    //Get all users

const getallUser = asyncHandler(async (req, res) => {
   try {
    const getUsers = await User.find();
    res.json(getUsers);
   }
catch (error) {
    throw new Error(error);
}
});

//Get a single user

const getaUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    validateMongoDbId(id);

    try {
        // Ensure userId is a string and not an object
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Delete a single user

const deleteaUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    try {
        // Ensure userId is a string and not an object
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const blockUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
const block = await User.findByIdAndUpdate(id, {
    isBlocked: true,
},
{
    new:true,
}
);
res.json({
    message: "User is blocked",
});
    }catch (error) {
        throw new Error(error);
    }
}
);

const unblockUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try{
const unblock = await User.findByIdAndUpdate(id, {
    isBlocked: false,
},
{
    new:true,
}
);
res.json({
    message: "User is Unblocked",
});
    }catch (error) {
        throw new Error(error);
    }
});

module.exports = { 
    createUser, 
    loginUserController,
     getallUser,
      getaUser, 
      deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefeshToken,
    logout,
};
