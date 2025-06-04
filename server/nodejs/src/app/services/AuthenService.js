import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import createError from '../../utils/errorUtils.js';
const saltRounds = 10;

const AuthenService = {
    login: async (username, password) => {
        try {
            const user = await User.findByUsername(username);
            if (!user) {
                throw createError('Username is not correct', 400);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw createError('Password is not correct', 400);
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE,
                }
            )
            return {
                message: 'Login Successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email
                }
            }
        } catch (error) {
            console.error('Error in login service:', error);
            throw error;
        }
    },
    register: async (data) => {
        try {
            const { username, password, ...otherFields } = data;
            const userExists = await User.findByUsername(username);
            if (userExists) {
                throw createError('User already exists.', 401)
            }
            const hashPassword = await bcrypt.hash(password, saltRounds);
            const newData = {
                username,
                password: hashPassword,
                ...otherFields
            };
            await User.create(newData);
            return { data: 'Register success' };
        } catch (error) {
            console.error('Error in register service:', error);
            throw error;
        }
    }
};

export default AuthenService;
