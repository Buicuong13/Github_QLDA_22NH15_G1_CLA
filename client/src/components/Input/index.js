import classNames from 'classnames/bind'
import styles from './Input.module.scss'
const cx = classNames.bind(styles)
function Input({ className, type, placeholder, error, value, onChange, onBlur, checked, ...otherProps }) {
    const classes = cx({
        [className]: className
    })
    const props = {
        onChange,
        onBlur,
        checked,
    }
    return (
        <div className={cx('wrapper')}>
            <input
                className={classes}
                type={type}
                id={otherProps.id}
                name={otherProps.name}
                placeholder={placeholder}
                value={value}
                autoComplete={otherProps.autoComplete}
                {...props}
            />
            <span className={cx('message')}>{error}</span>

        </div>
    )
}

export default Input;


