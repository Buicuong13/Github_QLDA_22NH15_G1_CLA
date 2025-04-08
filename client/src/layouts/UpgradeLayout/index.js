import Navbar from '../../components/Navbar'
import classnames from 'classnames/bind';
import styles from './UpgradeLayout.module.scss';
const cx = classnames.bind(styles);
function UpgradeLayout({ children }) {

    return (<div className={cx('wrapper')}>
        <Navbar defaultLayout href='/home' />
        {children}
    </div>);
}

export default UpgradeLayout;