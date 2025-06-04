import UserService from '../services/UserService.js';
import express from 'express';
const app = express();
app.use(express.json());

class UserController {
    async showAllUser(req, res) {
        try {
            const users = await UserService.getAllUser();
            return res.status(200).json(
                users.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roleId: user.roleId,
                    capacity: user.capacity,
                    createdAt: user.createdAt
                }))
            );
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getAccount(req, res) {
        try {
            const { id } = req.user;
            const user = await UserService.getUserById(id);
            res.status(200).json({ id: user.id, name: user.name, email: user.email, capacity: user.capacity }); // Return only name and email
        } catch (error) {
            console.error("Error in getUser:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error in getUserById:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async findUserByUsername(req, res) {
        try {
            const username = req.query.search;
            const user = await UserService.findUserByUsername(username);
            return res.status(200).json({ name: user.name, email: user.email });
        } catch (error) {
            console.error("Error in getUserById:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateUserPassword(req, res) {
        try {
            const { id } = req.user;
            const { currentPassword, newPassword } = req.body;
            const result = await UserService.updatePassword(id, currentPassword, newPassword);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateUser:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateUserEmail(req, res) {
        try {
            const { id } = req.user;
            const { newEmail } = req.body;
            const result = await UserService.updateEmail(id, newEmail);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateUser:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async ChangeRoleId(req, res) {
        try {
            const { id } = req.user; // Lấy userId từ thông tin đăng nhập
            const { newRoleId, userId } = req.body; // Lấy newRoleId và userId từ request body
            const selectUserId = userId;
            const result = await UserService.changeRole(id, newRoleId, selectUserId);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getRoleId(req, res) {
        try {
            const { id } = req.user;
            const user = await UserService.getRoleId(id);
            res.status(200).json({ roleId: user.roleId }); // Return only name and email
        } catch (error) {
            console.error("Error in getUser:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async UpdateUserCapacity(req, res) {
        try {
            const { id } = req.user; // Lấy userId từ thông tin đăng nhập
            const { newCapacity, userId } = req.body; // Lấy newCapacity và userId từ request body
            const selectUserId = userId;
            const result = await UserService.updateCapacity(id, newCapacity, selectUserId);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new UserController();
