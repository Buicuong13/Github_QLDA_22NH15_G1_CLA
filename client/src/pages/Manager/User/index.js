import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './User.module.scss';
import UserManager from '../../../components/Manager/UserManager';
import Button from '../../../components/Button';
import Chart from '../../../components/Chart'
import { useAllUser } from '../../../hooks/useUser';
import { useAllHistoryUpgradePending } from '../../../hooks/useHistoryUpgrade';

const cx = classNames.bind(styles);
function User() {
    const { users, setUsers, allUser } = useAllUser();
    const [isOpen, setIsOpen] = useState(false);
    const { allUpgradePending } = useAllHistoryUpgradePending();
    console.log(allUpgradePending);
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    return (
        <div className={cx('wrapper')}>
            <Chart type={'UserChart'} items={users} />
            <UserManager itemsPerPage={5} items={users} setItems={setUsers} fullItems={allUser} />
            <div className={cx('block-btn')}>
                <Button
                    third
                    onClick={toggleDropdown}
                    icon={<i className={`fa-solid fa-bell ${cx('icon-modifier')}`}></i>}
                    className={cx('btn-modifier')}>
                    <span className={cx('text')}>{allUpgradePending.length}</span>
                </Button>
            </div>
            {isOpen && (
                <div className={cx('dropdown')}>
                    {allUpgradePending.length > 0
                        ? allUpgradePending.map((data, index) => (
                            <div key={index} className={cx('dropdown-item')}>
                                <strong>{data.userName}</strong>
                                <p className={cx('paragraph')}>Package Require: "{data.packageName}"</p>
                            </div>
                        ))
                        : <div className={cx('dropdown-item', 'no-notification')}>
                            <trong>
                                No notification
                            </trong>
                        </div>
                    }
                </div>
            )
            }
        </div >
    );
}

export default User;
