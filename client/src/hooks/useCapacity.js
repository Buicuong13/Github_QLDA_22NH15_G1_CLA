import { useEffect, useState } from 'react';
import * as capacityPackageService from '../services/capacityPackageService';
export const useAllCapacityPackage = () => {
    const [capacityPackages, setCapacityPackages] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await capacityPackageService.showAllCapacityPackages();
                setCapacityPackages(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    return { capacityPackages, setCapacityPackages }
};