import { useSelector } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import Input from "../../components/Input"
import UserNameVerifyForm from '../../components/Verify/UserNameVerifyForm';
import EmailVerifyForm from '../../components/Verify/EmailVerifyForm';
import CodeVerifyForm from '../../components/Verify/CodeVerifyForm';
import * as identifyService from '../../services/identifyService.js'
import { useState } from "react";
const cx = classNames.bind(styles);
function ForgotPassword() {
    const verify = useSelector((state) => state.verify);
    const [showUserNameVerifyForm, setShowUserNameVerifyForm] = useState(true);
    const [showEmailVerifyForm, setShowEmailVerifyForm] = useState(true);
    const [showCodeVerifyForm, setShowCodeVerifyForm] = useState(true);
    const validationSchema = Yup.object({
        password: Yup.string()
            .required('Required')
            .min(5, 'Must be less 5 characters'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match') // Validation for confirm password
            .required('Required')
    });
    const formik = useFormik({
        initialValues: {
            password: '',
            password_confirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: (value) => {
            const newPassword = value.password;
            const email = verify.email;
            const username = verify.userName;

            const fetchApi = async () => {
                try {
                    const res = await identifyService.updatePasswordAfterVerify({
                        username: username,
                        email: email,
                        newPassword: newPassword,
                    })
                    alert(res.message);
                    window.location.href = "../login";
                } catch (error) {
                    console.log(error);
                }
            }
            fetchApi();
        }
    })

    return (
        <div className={cx('wrapper')}>
            {showUserNameVerifyForm && <UserNameVerifyForm setShowUserNameVerifyForm={setShowUserNameVerifyForm} />}
            {!showUserNameVerifyForm && showEmailVerifyForm && <EmailVerifyForm setShowEmailVerifyForm={setShowEmailVerifyForm} />}
            {!showEmailVerifyForm && showCodeVerifyForm && <CodeVerifyForm setShowCodeVerifyForm={setShowCodeVerifyForm} />}
            {!showCodeVerifyForm &&
                <form className={cx("form")} onSubmit={formik.handleSubmit}>
                    <h2 className={cx("title")}>New password </h2>
                    <p>Enter to password</p>
                    <div className={cx('group-control')}>
                        <Input className={cx("input-control")}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                        />
                    </div>

                    <div className={cx('group-control')}>
                        <Input className={cx("input-control")}
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            value={formik.values.password_confirmation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password_confirmation && formik.errors.password_confirmation ? formik.errors.password_confirmation : null}
                        />
                    </div>
                    <button className={cx("btn-submit")} type='submit'>Confirm</button>
                </form>
            }
        </div>
    );
}

export default ForgotPassword;