const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createTokenAndSendCookie = (res, userId) => {
    const token = jwt.sign(
        {id: userId},
        'JWT_SECRET',
        {expiresIn: '7d'}
    );

    console.log(token);
    res.cookie('token', token)
    return token
}

exports.register = async (req, res) => {
    const {name, email, password, role} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser){
        res.json({ message: 'User already exist'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: role
    })

    createTokenAndSendCookie(res, newUser._id)

    res.json({ message: 'User Registered'})
}

exports.login = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
        return res.json({ message: "Incorrect password" });
    }

    const token = createTokenAndSendCookie(res, existingUser._id);

    res.json({ message: "User logged In", token });
    // res.json({ token })
}

exports.logout = async (req, res) => {
    res.cookie('token', '');
}

exports.profile = async (req, res) => {
    if (!req.user){
        return res.json({ message: 'User not found'})
    }

    const user = await User.findById(req.user._id).select('-password')
    // .populate('notes');
    res.json({ user });
}