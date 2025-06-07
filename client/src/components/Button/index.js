import classNames from 'classnames/bind'
import styles from './Button.module.scss'
import { Link } from 'react-router-dom'
const cx = classNames.bind(styles)
function Button({ to, href, first, second, third, four, five, children, className, icon, onClick, onBlur, type, disabled, tooltip }) {
    let Comp = 'button';
    const props = {
        onClick,
        onBlur,
        type,
        disabled
    }
    if (to) {
        props.to = to;
        Comp = Link;
    }
    if (href) {
        props.href = href;
        Comp = 'a';
    }

    // Tooltip support
    if (tooltip) {
        props['title'] = tooltip;
        props['aria-label'] = tooltip;
        props['tabIndex'] = 0;
    }

    const classes = cx('wrapper', {
        [className]: className,
        first,
        second,
        third,
        four,
        five,
        icon,
    });
    return (
        <Comp className={classes} {...props}>
            {icon && <span className={cx('icon')}>{icon}</span>}
            {children && <span className={cx('text')}>{children}</span>}
        </Comp>
    )
}

export default Button;