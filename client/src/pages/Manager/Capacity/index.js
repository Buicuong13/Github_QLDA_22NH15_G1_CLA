import classNames from 'classnames/bind';
import styles from './Capacity.module.scss';
import CapacityManager from '../../../components/Manager/CapacityManager';
import Chart from '../../../components/Chart'
import { useAllUser } from '../../../hooks/useUser';
const cx = classNames.bind(styles);
function Capacity() {
    const { users } = useAllUser();
    return (
        <div className={cx('wrapper')}>
            <Chart type={'CapacityChart'} items={users} />
            <CapacityManager />
        </div>
    );
}

export default Capacity;
