import React, { useEffect, useState } from 'react';
import styles from './HistoryUpgradeManager.module.scss'
import classNames from 'classnames/bind'
import Table from '../../Table';
import Button from '../../Button';
import Input from "../../Input";
import * as historyUpgradeService from '../../../services/historyUpgrade';
const cx = classNames.bind(styles);
function HistoryUpgradeManager() {
    const [currentItems, setCurrentItems] = useState([]);
    const [fullItems, setFullItems] = useState([]);
    const [valueInput, setValueInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await historyUpgradeService.showAllHistoryUpgrades();
                setCurrentItems(res.data);
                setFullItems(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    const columns = [
        {
            title: 'ID',
            key: 'id',
            width: '10%',
        },
        {
            title: 'USERNAME',
            key: 'userName',
            width: '25%',
        },
        {
            title: 'PACKAGE',
            key: 'packageName',
            width: '15%',
        },
        {
            title: 'SIZE',
            key: 'size',
            width: '15%',
            render: (size) => {
                return `${size}MB`
            }
        },
        {
            title: 'PRICE',
            key: 'price',
            width: '10%',
            render: (price) => {
                return `${price}$`
            }
        },
        {
            title: 'DATE',
            key: 'createdAt',
            width: '20%',
            render: (date) => {
                const handleDate = date.split('T17')[0];
                return `${handleDate}`;
            }
        },
        {
            title: 'STATUS',
            key: 'status',
            width: '20%',
        },
    ]
    const handleOnchange = (e) => {
        setValueInput(e.target.value);
        const newItems = fullItems.filter((fullItem) => {
            return fullItem.userName.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setCurrentItems(newItems);
    }
    return (<div className={cx('wrapper')}>
        <h1 className={cx('heading')}>History Upgrade</h1>
        <div className={cx('block-search')}>
            <Input className={cx('input')}
                id="search"
                name="search"
                type="text"
                placeholder="Search...."
                value={valueInput}
                onChange={handleOnchange}
            />
            <Button className={cx('btn-search')} icon={<i className="fa-solid fa-magnifying-glass"></i>} ></Button>
        </div>
        <Table currentItems={currentItems} columns={columns} />
    </div>);
}
export default HistoryUpgradeManager;