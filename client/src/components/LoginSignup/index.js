import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik';
import { Link } from 'react-router-dom'
import * as Yup from 'yup';
import classNames from "classnames/bind";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // option
import 'tippy.js/themes/light.css';
import styles from './LoginSignup.module.scss'
import Input from "../Input";
import Signup from '../Signup';
import * as loginService from '../../services/loginService'
import { authLogin } from '../../redux/actions/auth'
const cx = classNames.bind(styles)
function LoginSigup() {
    const [showFormSignup, setShowFormSignup] = useState(false);
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Required')
            .min(5, 'Must be at least 5 characters'),
        password: Yup.string()
            .required('Required')
            .min(5, 'Must be at least 5 characters'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (value) => {
            const fetchApi = async () => {
                try {
                    const res = await loginService.login(value);
                    if (res) {
                        dispatch(authLogin(res));
                    }
                }
                catch (error) {
                    console.log(error);
                    const data = error.response.data;
                    if (data.field === 'username') {
                        formik.setFieldError('username', data.message);
                    }
                    else {
                        formik.setFieldError('password', data.message);
                    }
                }
            }
            fetchApi();
        }
    })

    const handleOnclick = (e) => {
        setShowFormSignup(true)
    }

    return (<div className={cx('wrapper')}>

        <div className="block__intro">
            <div className="block__messege">  <h1 style={{ color: 'black' }}>WELCOME TO WEBSITE</h1></div>
            <div className={cx('block__description')}>
                <h1 style={{ color: 'white' }}>
                    SHOTBOX
                </h1>
            </div>
        </div>

        <div className="login-container">
            <form className={cx("login")} onSubmit={formik.handleSubmit}>

                <h2 className={cx("login-title")}>LOG IN</h2>
                <div className={cx('group-control')}>
                    <Input className={cx("login-control")}
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.username && formik.touched.username ?
                        <Tippy content={formik.errors.username} placement={'bottom'} >
                            <i className={`fa-solid fa-circle-exclamation ${cx('icon-modifier')}`}></i>
                        </Tippy> : null
                    }
                </div>

                <div className={cx('group-control')}>
                    <Input className={cx("login-control")}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password ?
                        <Tippy content={formik.errors.password} placement={'bottom'}>
                            <i className={`fa-solid fa-circle-exclamation ${cx('icon-modifier')}`}></i>
                        </Tippy> : null
                    }
                </div>

                <div className={cx('group-control')}>
                    <button type="submit" className={cx("btn-login")}>Log in</button>
                </div>

                <div className={cx("forgot")}>
                    <Link to="./identify">Forgot password?</Link>
                </div>

                <button className={cx("btn-signup")} type='button' onClick={handleOnclick}>Create new account</button>
            </form>
        </div>

        {showFormSignup &&
            <Signup setShowFormSignup={setShowFormSignup} />
        }

    </div>);
}

export default LoginSigup;