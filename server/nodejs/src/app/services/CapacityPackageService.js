import CapacityPackage from '../models/CapacityPackage.js';
import User from '../models/User.js';
import createError from '../../utils/errorUtils.js';  // Import module createError

const CapacityPackageService = {
    getAllCapacityPackages: async () => {
        try {
            const capacityPackages = await CapacityPackage.getAll();
            return capacityPackages;
        } catch (error) {
            console.error("Error in getAllCapacityPackages:", error);
            throw error;
        }
    },
    createCapacityPackage: async (userId, data) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found', 404);
            }
            if (userExists.roleId === 1) {
                await CapacityPackage.create(data);
                return true;
            } else {
                throw createError('You do not have permission to create capacity packages', 403);
            }
        } catch (error) {
            console.error("Error in createCapacityPackage:", error);
            throw error;
        }
    },
    updateCapacityPackage: async (userId, idPackage, data) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found', 404);
            }
            if (userExists.roleId === 1) {
                const result = await CapacityPackage.update(idPackage, data);
                if (result === 0) {
                    throw createError('Failed to update capacity package.', 404);
                }
                return true;
            } else {
                throw createError('You do not have permission to update capacity packages', 403);
            }
        } catch (error) {
            console.error("Error in updateCapacityPackage:", error);
            throw error;
        }
    },
    deleteCapacityPackage: async (userId, idPackage) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found', 404);
            }
            if (userExists.roleId === 1) {
                const result = await CapacityPackage.delete(idPackage);
                if (result === 0) {
                    throw createError('Failed to delete capacity package.', 404);
                }
                return true;
            } else {
                throw createError('You do not have permission to delete capacity packages', 403);
            }
        } catch (error) {
            console.error("Error in deleteCapacityPackage:", error);
            throw error;
        }
    }
};

export default CapacityPackageService;
