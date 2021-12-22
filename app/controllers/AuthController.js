const Users = require('../modules/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthController = {
    register: async (req, res) => {
        try {
            const { fullname, email, password, username } = req.body;
            let newUsername = username.toLowerCase().replace(/ /g, '');
            const user_name = await Users.findOne({ username: newUsername });
            if (user_name)
                return res
                    .status(400)
                    .json({ message: 'This Username already exists.' });
            if (username.length < 5)
                return res.status(400).json({
                    message: 'Username must be at least 5 characters.',
                });

            const user_email = await Users.findOne({ email });
            if (user_email)
                return res
                    .status(400)
                    .json({ message: 'This Email already exists.' });

            if (password.length < 6)
                return res.status(400).json({
                    message: 'Password must be at least 6 characters.',
                });
            const hashPassword = await bcrypt.hash(password, 12);

            const newUser = new Users({
                fullname,
                email,
                password: hashPassword,
                username: newUsername,
            });

            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = refreshAccessToken({ id: newUser._id });

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
            });

            await newUser.save();

            return res.status(201).json({
                message: 'Created successfully, Please Login',
                accessToken,
                user: {
                    ...newUser._doc,
                    password: '',
                },
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email }).populate(
                'followers following',
                '-password'
            );
            if (!user)
                return res.status(400).json({
                    message: 'This Email does not exist',
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: 'Password is not correct',
                });

            const accessToken = createAccessToken({ id: user._id });
            const refreshToken = refreshAccessToken({ id: user._id });

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                message: 'Login successfully',
                accessToken,
                user: {
                    ...user._doc,
                    password: '',
                },
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
            return res.status(200).json({ message: 'Logged out' });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) {
                return res.status(400).json({ message: 'Please login now' });
            }

            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, result) => {
                    if (err)
                        return res
                            .status(400)
                            .json({ message: 'Please login now' });
                    const user = await Users.findById(result.id)
                        .select('-password')
                        .populate('followers following', '-password')
                        .populate('saved', '');
                    if (!user)
                        return res
                            .status(400)
                            .json({ message: 'This does not exist.' });
                    const accessToken = createAccessToken({ id: result.id });
                    res.status(200).json({ accessToken: accessToken, user });
                }
            );
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};
const refreshAccessToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = AuthController;
