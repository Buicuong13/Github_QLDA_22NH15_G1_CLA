import { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './FormUpdate.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAllCapacityPackage } from '../../hooks/useCapacity';
import { useHistoryUpgradePending } from '../../hooks/useHistoryUpgrade';
import * as userService from '../../services/userService';
const cx = classNames.bind(styles);
function FormUpdate({ setShowFormUpdate, checkRoleId, userId }) {

    const listCapacityPending = [];
    const roleSelectRef = useRef();
    const capacitySelectRef = useRef();
    const { capacityPackages } = useAllCapacityPackage();
    const { upgradePending } = useHistoryUpgradePending(userId);
    const [isSaving, setIsSaving] = useState(false);

    upgradePending.map((item) => {
        listCapacityPending.push(item.size);
    })

    const updateRoleIdData = async (data) => {
        try {
            const res = await userService.updateRoleId(data);
            toast.success(`Success:${res.message}`, {
                position: "bottom-center",
                autoClose: 1000,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (error) {
            console.log(error);
            toast.success(`Error:${error.respone.data.message}`, {
                position: "bottom-center",
                autoClose: 1000,
            });
        }
    }

    const updateCapacityData = async (data1, data2) => {
        try {
            const res1 = await userService.updateRoleId(data1);
            const res2 = await userService.updateUserCapacity(data2);
            if (res1.message && res2.message) {
                toast.success(`Success: Updated successfully`, {
                    position: "bottom-center",
                    autoClose: 1000,
                    onClose: () => {
                        window.location.reload();
                    }
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(`Error: Update Failed`, {
                position: "bottom-center",
                autoClose: 1000,
            });
        }
    }

    const handleSave = (e) => {
        setIsSaving(true);
        const roleSelectElement = roleSelectRef.current;
        const capacitySelectElement = capacitySelectRef.current;
        if (capacitySelectElement.selectedIndex > 0 && listCapacityPending.length > 0) {

            if (listCapacityPending.includes(parseInt(capacitySelectElement.value))) {
                const data1 = {
                    newRoleId: parseInt(roleSelectElement.value),
                    userId: userId,
                }

                const data2 = {
                    newCapacity: parseInt(capacitySelectElement.value),
                    userId: userId,
                }
                updateCapacityData(data1, data2);
            }
            else {
                toast.error('Please choose correct capacity package', {
                    position: 'bottom-center',
                    autoClose: 1000,
                })
            }
            setIsSaving(false);
        }
        else if (capacitySelectElement.selectedIndex > 0 && listCapacityPending.length === 0) {
            toast.error('User dont require upgrade', {
                position: 'bottom-center',
                autoClose: 1000,
            })
            setIsSaving(false);
        }
        else {
            const data = {
                newRoleId: parseInt(roleSelectElement.value),
                userId: userId,
            }
            updateRoleIdData(data);
        }
    }

    const handleCancel = (e) => {
        if (isSaving) return;
        setShowFormUpdate(false);
    }

    return (<div className={cx('wrapper')}>
        <div className={cx('block')}>
            <label htmlFor="roleId" className={cx('label')}>Choose a role:</label>
            <select name="role" id="role" defaultValue={checkRoleId} ref={roleSelectRef} className={cx('select-option')}>
                <option value="1">Admin</option>
                <option value="2">User</option>
            </select>
            <label htmlFor="capacity" className={cx('label')}>Choose a capacity:</label>
            <select name="capacity" id="capacity" ref={capacitySelectRef} className={cx('select-option')}>
                <option value="option">Option</option>
                {
                    capacityPackages && capacityPackages.map((item) => {
                        return listCapacityPending.includes(item.size)
                            ? <option key={item.id} value={`${item.size}`} className={cx('option-modifier')}>{`${item.name} - ${item.size}MB`}</option>
                            : <option key={item.id} value={`${item.size}`} >{`${item.name} - ${item.size}MB`}</option>
                    })
                }
            </select>
            <div>
                <button className={cx('btn')} onClick={handleCancel}>Cancel</button>
                <button className={cx('btn')} onClick={handleSave}>Save</button>
            </div>
        </div>
        <ToastContainer />
    </div>);
}

export default FormUpdate;