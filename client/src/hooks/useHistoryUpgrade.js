import { useEffect, useState } from 'react';
import * as historyUpgradeService from '../services/historyUpgrade';
export const useHistoryUpgradePending = (userId) => {
    const [upgradePending, setUpgradePending] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const res = await historyUpgradeService.showUpgradePending(userId);
                setUpgradePending(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [userId]);
    return { upgradePending, setUpgradePending };
};

export const useAllHistoryUpgradePending = () => {
    const [allUpgradePending, setAllUpgradePending] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await historyUpgradeService.showHistoryUpgradePanding();
                setAllUpgradePending(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    return { allUpgradePending, setAllUpgradePending }
};
export const useHistoryUpgradeSuccess = () => {
    const [upgradeSucess, setUpgradeSucess] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await historyUpgradeService.showUpgradeSucess();
                setUpgradeSucess(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    return { upgradeSucess, setUpgradeSucess }
};