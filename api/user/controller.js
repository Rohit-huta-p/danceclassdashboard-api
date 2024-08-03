const User = require('./model')
// ENCRYPTION PASSWORD
const bcrypt = require('bcryptjs')
const encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log('Error hashing the password', error);
        throw error;
    }
}
const comparePass = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(isMatch) return true
    } catch (error) {
        console.log("Password does not match", error);
        throw error;
    }
}

// Token
const jwt = require('jsonwebtoken')

// COOKIE


const generateToken = (user) => {
    return jwt.sign({ userId: user._id, username: user.name }, process.env.JWT_SECRET, {expiresIn: "3h"})
}

const registerUser = async (req, res) => {
    console.log("HELLO");
    const {name, email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({error: 'User already exists'});
    }else{
        const hashedPassword = await encryptPassword(password);
        const newUser = await new User({name, email, password: hashedPassword});
        newUser.save();
        return res.status(200).json({message: 'User created successfully'});
    }
}


const loginUser = async (req, res) => {

    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user){
        const isPassChecked = await comparePass(password, user.password);
        if(isPassChecked){
            console.log(isPassChecked);
            const token = generateToken(user._id);
            res.cookie('token', token,{httpOnly:true});
            return res.json({token, message: "You are logged In"});
        }else{
            return res.status(401).json({error: 'Password does not match'});
        }
    }else{
        return res.status(404).json({error: 'Email Not Found!'});
    }
}


const logout = (req, res) => {
    if(req.cookies.token){
        res.clearCookie('token');
        return res.json({status: true, message: "Logeed out"});
    }else{
        return res.json({status: true, message: "No token"});
    }
}


const fetchUserDetails = (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {registerUser, loginUser, logout, fetchUserDetails}