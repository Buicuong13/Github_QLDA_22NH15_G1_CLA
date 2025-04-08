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
        <div className={cx('wrapper')}>
            <form action="" className={cx("signup")} onSubmit={formik.handleSubmit}>
                <i className={`fa-solid fa-xmark ${cx('xmark')}`} onClick={handleOnclick}></i>
                <h2 className={cx("signup-title")}>CREATE AN ACCOUNT </h2>
                <div className={cx('group-control')}>
                    <Input className={cx("signup-control")}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && formik.errors.username ? formik.errors.username : null}
                    />
                </div>

                <div className={cx('group-control')}>
                    <Input className={cx("signup-control")}
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                    />
                </div>

                <div className={cx('group-control')}>
                    <Input className={cx("signup-control")}
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
                    <Input className={cx("signup-control")}
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
                <button className={cx("signup-submit")} type='submit'>Register</button>
            </form>
        </div>
    );
}
export default Signup;