import { useFormik } from 'formik';
import { useDispatch } from 'react-redux'
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import styles from './UserNameVerifyForm.module.scss';
import Input from '../../Input'
import { verifyUserName, verifyEmail } from '../../../redux/actions/verify'
import * as userService from '../../../services/userService.js'
const cx = classNames.bind(styles);
function UserNameVerifyForm({ setShowUserNameVerifyForm }) {
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Required')
    });

    const formik = useFormik({
        initialValues: {
            username: '',
        },
        validationSchema: validationSchema,
        onSubmit: (value) => {
            const userName = value.username;
            const fetchApi = async () => {
                try {
                    const res = await userService.getUserByUsername(userName);
                    dispatch(verifyUserName(res.name));
                    dispatch(verifyEmail(res.email));
                    setShowUserNameVerifyForm(false);
                } catch (error) {
                    console.log(error)
                }
            }
            fetchApi();
        }
    })
    return (<div className={cx('wrapper')}>
        <form className={cx("form")} onSubmit={formik.handleSubmit}>
            <i className={`fa-sharp fa-solid fa-arrow-left ${cx('icon-modifier')}`} onClick={() => {
                window.location.href = '../login';
            }}></i>
            <img src="https://png.pngtree.com/png-clipart/20230925/original/pngtree-comicstyle-login-icon-with-password-access-and-padlock-splash-vector-png-image_12861184.png" className={cx('img-modifier')} alt="Company logo"></img>
            <h2 className={cx("title")}>Find your account </h2>
            <p>Please enter account.</p>
            <div className={cx('group-control')}>
                <Input className={cx("input-control")}
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && formik.errors.username ? formik.errors.username : null}
                />
            </div>
            <button className={cx("btn-submit")} type='submit'>Request</button>
        </form>
    </div>);
}

export default UserNameVerifyForm;