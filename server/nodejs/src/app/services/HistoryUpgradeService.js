import HistoryUpgrade from '../models/HistoryUpgrade.js';
import User from '../models/User.js';
import createError from '../../utils/errorUtils.js';

const HistoryUpgradeService = {
    getAllHistoryUpgrade: async (userId) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found', 404);
            }
            if (userExists.roleId === 1) {
                const listHistoryUpgrade = await HistoryUpgrade.getAllHistoryUpgrade();
                return { data: listHistoryUpgrade };
            } else {
                throw createError('You do not have permission', 403);
            }
        } catch (error) {
            console.error("Error in createCapacityPackage:", error);
            throw error;
        }
    },
    getHistoryUpgradePading: async (userId) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found', 404);
            }
            if (userExists.roleId === 1) {
                const listHistoryUpgradePanding = await HistoryUpgrade.getHistoryUpgradePading();
                return { data: listHistoryUpgradePanding };
            } else {
                throw createError('You do not have permission', 403);
            }
        } catch (error) {
            console.error("Error in createCapacityPackage:", error);
            throw error;
        }
    },
    createNewUpgrade: async (userId, data) => {
        try {
            const userPending = await HistoryUpgrade.checkPendingByUserId(userId);
            if (userPending.length > 0) {
                throw createError('Waiting for admin confirmation.', 409);
            }
            await HistoryUpgrade.create(data, userId);
            return { message: 'Request submitted successfully.' };
        } catch (error) {
            console.error("Error in updateCapacityPackage:", error);
            throw error;
        }
    },
    getUpgradePendingOfUser: async (userId, selectUserId) => {
        try {
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw createError('User not found', 404);
            }
            if (userExists.roleId === 1) {
                const listHistoryUpgrade = await HistoryUpgrade.getByUserIdAndStatus(selectUserId, 'pending');
                return { data: listHistoryUpgrade };
            } else {
                throw createError('You do not have permission', 403);
            }
        } catch (error) {
            console.error("Error in createCapacityPackage:", error);
            throw error;
        }
    },
    getUpgradeSuccessOfUser: async (userId) => {
        try {
            const listHistoryUpgrade = await HistoryUpgrade.getByUserIdAndStatus(userId, 'success');
            return { data: listHistoryUpgrade };
        } catch (error) {
            console.error("Error in createCapacityPackage:", error);
            throw error;
        }
    },
};

export default HistoryUpgradeService;
