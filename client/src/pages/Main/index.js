import styles from './Main.module.scss'
import classNames from 'classnames/bind';
const cx = classNames.bind(styles)
function Main() {
    return (
        <div className={cx('wrapper')}>
        </div>);
}

export default Main;