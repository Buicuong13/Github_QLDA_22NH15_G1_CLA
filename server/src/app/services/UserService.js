import bcrypt from 'bcrypt';
import User from '../models/User.js';
import HistoryUpgrade from '../models/HistoryUpgrade.js';
import createError from '../../utils/errorUtils.js';

const UserService = {
    getAllUser: async () => {
        try {
            const listUser = await User.getAllUsers();
            return listUser;
        } catch (error) {
            console.error('Error in getIdentify:', error);
            throw error;
        }
    },
    getUserById: async (userId) => {
        try {
            const userExists = await User.findById(userId)
            if (!userExists) {
                throw createError('User not found.', 404);
            }
            return userExists;
        } catch (error) {
            console.error('Error in handleSendMail:', error);
            throw error;
        }
    },
    findUserByUsername: async (username) => {
        try {
            const userExists = await User.findByUsername(username);
            if (!userExists) {
                throw createError('User not found.', 404);
            }
            return userExists;
        } catch (error) {
            console.error('Error in updateNewPassword:', error);
            throw error;
        }
    },
    updatePassword: async (userId, currentPassword, newPassword) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found.', 404);
            }
            if (currentPassword && !(await bcrypt.compare(currentPassword, userExists.password))) {
                throw createError('Incorrect current password.', 400);
            }
            let hashedPassword = userExists.password; // Giữ mật khẩu cũ nếu không có mật khẩu mới
            if (newPassword) {
                hashedPassword = await bcrypt.hash(newPassword, 10);
            }
            const updatedData = {
                email: userExists.email,
                password: hashedPassword,
            };
            const updated = await User.update(userId, updatedData);
            if (updated) {
                return { message: 'Password updated successfully.' };
            }
            throw createError('Failed to update user.', 500);
        } catch (error) {
            console.error('Error in updateNewPassword:', error);
            throw error;
        }
    },
    updateEmail: async (userId, newEmail) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found.', 404);
            }
            const userPassword = userExists.password;
            const updatedData = {
                email: newEmail,
                password: userPassword,
            };
            const updated = await User.update(userId, updatedData);
            if (updated) {
                return { message: 'Email updated successfully.' };
            }
            throw createError('Failed to update user.', 500);
        } catch (error) {
            console.error('Error in updateNewPassword:', error);
            throw error;
        }
    },
    changeRole: async (userId, newRoleId, selectUserId) => {
        try {
            const userExists = await User.findById(userId); // Check userExists
            if (!userExists) {
                throw createError('User not found.', 404);
            }
            if (userExists.roleId !== 1) {
                throw createError('You do not have permission to change roles', 403);
            }
            const userToUpdate = await User.findById(selectUserId);
            if (!userToUpdate) {
                throw createError('User not found', 404);
            }
            if (![1, 2].includes(newRoleId)) {
                throw createError('Invalid newRoleId', 400);
            }
            const updateRows = await User.updateRoleId(newRoleId, selectUserId);
            if (updateRows === 0) {
                throw createError('Failed to update role', 404);
            }
            return { message: 'Role updated successfully' };
        } catch (error) {
            console.error('Error in updateNewPassword:', error);
            throw error;
        }
    },
    getRoleId: async (userId) => {
        try {
            const userExists = await User.findById(userId)
            if (!userExists) {
                throw createError('User not found.', 404);
            }
            return userExists;
        } catch (error) {
            console.error('Error in updateNewPassword:', error);
            throw error;
        }
    },
    updateCapacity: async (userId, newCapacity, selectUserId) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('Admin user not found', 404);
            }
            if (userExists.roleId !== 1) {
                throw createError('You do not have permission to update capacity', 403);
            }
            const userToUpdate = await User.findById(selectUserId);
            if (!userToUpdate) {
                throw createError('User not found', 404);
            }
            if (typeof newCapacity !== 'number' || newCapacity <= 0) {
                throw createError('Invalid capacity value', 400);
            }
            const updateResult = await User.updateCapacity(newCapacity, selectUserId);
            if (!updateResult) {
                throw createError('Failed to update capacity or capacity is the same', 400);
            }
            await HistoryUpgrade.updateStatusByUserId(selectUserId);
            return { message: 'User capacity updated successfully' };
        } catch (error) {
            console.error('Error in UpdateUserCapacityService:', error);
            throw error;
        }
    }
};

export default UserService;
