import { useState, useEffect } from 'react';
import * as userService from '../services/userService';
export const useAllUser = () => {
    const [users, setUsers] = useState([]);
    const [allUser, setAllUser] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await userService.getAllUsers();
                setUsers(res);
                setAllUser(res);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    return { users, setUsers, allUser, setAllUser };
};