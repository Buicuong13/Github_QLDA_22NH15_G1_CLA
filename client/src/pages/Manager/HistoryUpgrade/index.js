import classNames from 'classnames/bind';
import styles from './HistoryUpgrade.module.scss';
import HistoryUpgradeManager from '../../../components/Manager/HistoryUpgradeManager';

const cx = classNames.bind(styles);

function HistoryUpgrade() {
    return (
        <div className={cx('wrapper')}>
            <HistoryUpgradeManager />
        </div>
    );
}

export default HistoryUpgrade;
