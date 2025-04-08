import { useSelector } from 'react-redux'
import { useFormik } from 'formik';
import classNames from 'classnames/bind';
import styles from './EmailVerifyForm.module.scss';
import * as Yup from 'yup';
import Input from '../../Input'
import * as identifyService from '../../../services/identifyService.js'
const cx = classNames.bind(styles);

function EmailVerifyForm({ setShowEmailVerifyForm }) {
    const verify = useSelector((state) => state.verify);
    const validationSchema = Yup.object({
        email: Yup.string()
            .required('Required')
            .email('Invalid email address'),
    });
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (value) => {
            console.log("aaa", verify);
            console.log(value);
            if (value.email === verify.email) {
                const email = value.email;
                const fetchApi = async () => {
                    try {
                        const res = await identifyService.requestCodeByEmail({
                            email: email,
                        });
                        alert(res.message);
                        setShowEmailVerifyForm(false);
                    } catch (error) {
                        console.log(error);
                    }
                }
                fetchApi();
            }
            else {
                console.log('error');
            }
        }
    })
    return (<div className={cx('wrapper')}>
        <form className={cx("form")} onSubmit={formik.handleSubmit}>
            <h2 className={cx("title")}>Find your email </h2>
            <p>Please enter your email.</p>
            <div className={cx('group-control')}>
                <Input className={cx("input-control")}
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
            <button className={cx("btn-submit")} type='submit'>Request</button>
        </form>
    </div>);
}

export default EmailVerifyForm;