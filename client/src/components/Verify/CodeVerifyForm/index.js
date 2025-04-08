import classNames from 'classnames/bind';
import styles from './CodeVerifyForm.module.scss';
import { useFormik } from 'formik';
import Input from '../../Input'
import * as identifyService from '../../../services/identifyService.js'
const cx = classNames.bind(styles);

function CodeVerifyForm({ setShowCodeVerifyForm }) {
    const formik = useFormik({
        initialValues: {
            code: '',
        },
        onSubmit: (value) => {
            const idCode = value.code;
            const fetchApi = async () => {
                try {
                    const res = await identifyService.vertifyCode(idCode);
                    alert(res.message);
                    setShowCodeVerifyForm(false);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchApi();
        }
    })
    return (<div className={cx('wrapper')}>
        <form className={cx("form")} onSubmit={formik.handleSubmit}>
            <h2 className={cx("title")}>Get code from email </h2>
            <p>The code will expire after 30s.</p>
            <div className={cx('group-control')}>
                <Input className={cx("input-control")}
                    type="text"
                    id="code"
                    name="code"
                    placeholder="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.code && formik.errors.code ? formik.errors.code : null}
                />
            </div>
            <button className={cx("btn-submit")} type='submit'>Send</button>
        </form>
    </div>);
}

export default CodeVerifyForm;