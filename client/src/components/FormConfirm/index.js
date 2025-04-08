import styles from './FormConfirm.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function FormConfirm({ children, title, content }) {
    return (<div className={cx('wrapper')}>
        <div className={cx('block-confirm')}>
            <h1 className={cx('title-confirm')}>{title}</h1>
            <p className={cx('text-confirm')}>{content}</p>
            {children}
        </div>
    </div>);
}

export default FormConfirm;