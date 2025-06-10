import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from "classnames/bind";
import styles from './Signup.module.scss'
import * as registerService from '../../services/registerService';
import Input from "../Input";
const cx = classNames.bind(styles)
function Signup({ setShowFormSignup }) {

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Required')
            .min(5, 'Must be less 5 characters'),
        email: Yup.string()
            .required('Required')
            .email('Invalid email address'),
        password: Yup.string()
            .required('Required')
            .min(5, 'Must be less 5 characters'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match') // Validation for confirm password
            .required('Required')
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: (value) => {
            const fetchApi = async () => {
                try {
                    const res = await registerService.register(value);
                    if (res) {
                        window.location.reload();
                    }
                } catch (error) {
                    console.log("error: ", error);
                    formik.setFieldError('username', error.response.data.message);
                }
            }
            fetchApi();
        }
    })

    const handleOnclick = (e) => {
        setShowFormSignup(false)
    }

    return (
        <div className={cx('signup-container')} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <form className={cx('login', 'login-modern')} onSubmit={formik.handleSubmit} style={{position: 'relative', minWidth: 340, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(25,118,210,0.10)', padding: 32, margin: 0}}>
                <i className={`fa-solid fa-xmark ${cx('xmark')}`} onClick={handleOnclick} style={{position: 'absolute', top: 18, right: 22, fontSize: 22, cursor: 'pointer'}}></i>
                <h2 className={cx('login-title-modern')} style={{fontWeight: 700, marginBottom: 16}}>CREATE AN ACCOUNT</h2>
                <div className={cx('group-control')} style={{marginBottom: 18}}>
                    <label className={cx('login-form-label')} htmlFor="username" style={{position: 'static', left: 'unset', top: 'unset', fontSize: '1rem', color: '#1976d2', background: 'none', padding: 0, marginBottom: 4, display: 'block'}}>Username</label>
                    <Input className={cx('login-control', 'login-form-control')}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div style={{color: '#e53935', fontSize: '0.95rem', marginTop: 2}}>{formik.errors.username}</div>
                    )}
                </div>
                <div className={cx('group-control')} style={{marginBottom: 18}}>
                    <label className={cx('login-form-label')} htmlFor="email" style={{position: 'static', left: 'unset', top: 'unset', fontSize: '1rem', color: '#1976d2', background: 'none', padding: 0, marginBottom: 4, display: 'block'}}>Email</label>
                    <Input className={cx('login-control', 'login-form-control')}
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div style={{color: '#e53935', fontSize: '0.95rem', marginTop: 2}}>{formik.errors.email}</div>
                    )}
                </div>
                <div className={cx('group-control')} style={{marginBottom: 18}}>
                    <label className={cx('login-form-label')} htmlFor="password" style={{position: 'static', left: 'unset', top: 'unset', fontSize: '1rem', color: '#1976d2', background: 'none', padding: 0, marginBottom: 4, display: 'block'}}>Password</label>
                    <Input className={cx('login-control', 'login-form-control')}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{color: '#e53935', fontSize: '0.95rem', marginTop: 2}}>{formik.errors.password}</div>
                    )}
                </div>
                <div className={cx('group-control')} style={{marginBottom: 18}}>
                    <label className={cx('login-form-label')} htmlFor="password_confirmation" style={{position: 'static', left: 'unset', top: 'unset', fontSize: '1rem', color: '#1976d2', background: 'none', padding: 0, marginBottom: 4, display: 'block'}}>Confirm Password</label>
                    <Input className={cx('login-control', 'login-form-control')}
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                        <div style={{color: '#e53935', fontSize: '0.95rem', marginTop: 2}}>{formik.errors.password_confirmation}</div>
                    )}
                </div>
                <div className={cx('login-btn-row')} style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                  <button className={cx('btn-login', 'btn-login--large')} type='submit' style={{margin: '0 auto', display: 'block'}}>Register</button>
                </div>
            </form>
        </div>
    );
}
export default Signup;