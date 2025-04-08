import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames/bind';
import styles from './Navbar.module.scss';
import Button from '../Button';
import UpLoad from '../Upload';
import { authLogout } from '../../redux/actions/auth';
import * as userService from '../../services/userService.js';
const cx = classnames.bind(styles);
function NavBar({ mainLayout, defaultLayout, children }) {
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const [showUpload, setShowUpload] = useState(false);
    const [showMenuItems, setShowMenuItems] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await userService.getUser();
                setUser({
                    name: res.name,
                    email: res.email,
                });
            } catch (error) {
                console.log(error);
            }
        };
        if (localStorage.getItem('authToken')) {
            fetchApi();
        }
    }, []);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenuItems(false);
        }
    };

    useEffect(() => {
        if (showMenuItems) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenuItems]);

    return (
        <div className={cx('wrapper')}>
            <Link className={cx('logo')} to="../home"></Link>
            {children}
            {mainLayout && (
                <div className={cx('actions')}>
                    <Button first to='/login'>Log In</Button>
                </div>
            )}
            {defaultLayout && (
                <div className={cx('fix-toolbar')}>
                    <div className={cx('actions')}>
                        <Button second onClick={() => setShowUpload(true)}>UPLOAD</Button>
                    </div>

                    <div className={cx('actions')}>
                        <Button icon={<i className="fa-regular fa-user"></i>} className={cx('fa-user-modifier')}></Button>
                    </div>

                    <div className={cx('actions')}>
                        <Button to='/user' className={cx('text-modifier')}>{user ? user.name : ""}</Button>
                    </div>

                    <div className={cx('option')} ref={menuRef} onClick={() => setShowMenuItems(!showMenuItems)}>
                        <i className="fa-solid fa-ellipsis-vertical" ></i>
                        {showMenuItems && (
                            <div className={cx('menu-items')}>
                                <Button to='/user' four icon={<i className={`fa-solid fa-gear ${cx('icon-modifier')}`}></i>}>Settings</Button>
                                <Button to='/deleted/images' four icon={<i className={`fa-solid fa-trash ${cx('icon-modifier')}`}></i>}>Recycle Bin</Button>
                                <Button four onClick={() => dispatch(authLogout())} icon={<i className={`fa-solid fa-right-from-bracket ${cx('icon-modifier')}`}></i>}>Logout</Button>
                            </div>
                        )}
                    </div>
                </div>
            )
            }
            {
                showUpload && <UpLoad setShowUpload={setShowUpload} />
            }
        </div >
    );
}

export default NavBar;
