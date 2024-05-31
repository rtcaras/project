const { generateToken } = require('../config/jwtoken');
const User = require('../models/usermodel');
const asyncHandler = require("express-async-handler");

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

const loginUserController = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
   // check if user exist or not
   const findUser = await User.findOne({ email });
if (findUser && await findUser.isPasswordMatched(password)) {
res.json({
    _id: findUser?._id,
    firstname: findUser?.firstname,
    lastname: findUser?.lastname,
    email: findUser?.email,
    mobile: findUser?.mobile,
    token: generateToken(findUser?._id),
});
} else  {
    throw new Error("Invalid Credentials");
    res.json(findUser);
}

    });

    //Update a user

    const updatedUser = asyncHandler(async(req, res) =>{
        const {id} = req.params;
        try {
const updatedUser = await User.findByIdAndUpdate(
    id, 
    {
    firstname: req?.body?.firstname,
    lastname: req?.body?.lastname,
    email: req?.body?.email,
    mobile: req?.body?.mobile,
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

module.exports = { 
    createUser, 
    loginUserController,
     getallUser,
      getaUser, 
      deleteaUser,
    updatedUser,
};
