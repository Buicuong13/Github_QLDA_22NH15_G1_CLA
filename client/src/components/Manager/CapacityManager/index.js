import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './CapacityManager.module.scss';
import Table from '../../Table';
import Button from '../../Button';
import FormConfirm from '../../FormConfirm';
import FormCapacity from '../../FormCapacity';
import * as capacityPackageService from '../../../services/capacityPackageService';
const cx = classNames.bind(styles);
function CapacityManager() {
    const [currentItems, setCurrentItems] = useState([]);
    const [titleCapacity, setTitleCapacity] = useState('');
    const [capacityDetail, setCapacityDetail] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);  // true is update , false is add
    const [showFormConfirm, setShowFormConfirm] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await capacityPackageService.showAllCapacityPackages();
                setCurrentItems(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    const columns = [
        {
            title: 'ID',
            key: 'id',
            width: '10%',
        },
        {
            title: 'NAME',
            key: 'name',
            width: '10%',
        },
        {
            title: 'SIZE',
            key: 'size',
            width: '10%',
            render: (size) => {
                return `${size}MB`
            }
        },
        {
            title: 'DESCRIPTION',
            key: 'description',
            width: '40%',
        },
        {
            title: 'PRICE',
            key: 'price',
            width: '10%',
            render: (price) => {
                return `${price}$`
            }
        }
    ]
    const actions = [
        {
            title: 'UPDATE',
            width: '15%',
            handler: (item) => {
                const { id, name, size, description, price } = item;
                setCapacityDetail({ id, name, size, description, price });
                setIsUpdate(true);
                setTitleCapacity('Update Capacity')
            }
        },
        {
            title: 'DELETE',
            width: '15%',
            handler: (item) => {
                const { id, name, size, description, price } = item;
                setCapacityDetail({ id, name, size, description, price });
                setShowFormConfirm(true);
            }
        }
    ]
    const deleteCapacity = async (idPackage) => {
        try {
            await capacityPackageService.deleteCapacityPackage(idPackage);
            window.location.reload();
        } catch (error) {
            console.log(error);
            toast.error(`Error:${error.respone.data.message}`, {
                position: 'bottom-center',
                autoClose: 1000,
            })
        }
    }
    const handleAdd = (e) => {
        setIsUpdate(false);
        setTitleCapacity('Add New Capacity')
    }
    const handleUnmount = (e) => {
        setCapacityDetail({});
        setTitleCapacity('')
    }
    const handleConfirmCancel = (e) => {
        setShowFormConfirm(false);
        setCapacityDetail({});
    }
    const handleConfirmDelete = (e) => {
        const idPackage = capacityDetail.id;
        deleteCapacity(idPackage);
    }
    return (<div className={cx('wrapper')}>
        <div className={cx('header')}>
            <Button first className={cx('btn-modifier')} onClick={handleAdd}>Add</Button>
            <h1 className={cx('heading')}>Manage Capacity</h1>
        </div>
        <Table currentItems={currentItems} columns={columns} actions={actions} />
        {
            titleCapacity && <FormCapacity title={titleCapacity} handleUnmount={handleUnmount} capacityDetail={capacityDetail} isUpdate={isUpdate} />
        }
        {
            showFormConfirm && <FormConfirm title={"Confirm"} content={"Do you want to delete this capacity package?"}>
                <div className={cx('buttons')}>
                    <Button first className={cx('btn-cancel')} onClick={handleConfirmCancel}>Cancel</Button>
                    <Button first className={cx('btn-delete')} onClick={handleConfirmDelete}>Delete</Button>
                </div>
            </FormConfirm>
        }
        <ToastContainer />
    </div>);
}
export default CapacityManager;