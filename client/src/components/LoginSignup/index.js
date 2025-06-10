import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import classNames from "classnames/bind";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import styles from './LoginSignup.module.scss';
import Input from "../Input";
import Signup from '../Signup';
import * as loginService from '../../services/loginService';
import { authLogin } from '../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faGoogle } from '@fortawesome/free-brands-svg-icons';
const cx = classNames.bind(styles);

function LoginSigup() {
    const [showFormSignup, setShowFormSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                    const data = error.response?.data;
                    if (data?.field === 'username') {
                        formik.setFieldError('username', data.message);
                    } else {
                        formik.setFieldError('password', data?.message || 'Login failed');
                    }
                }
            };
            fetchApi();
        }
    });

    const handleOnclick = () => setShowFormSignup(true);

    return (
      <div className={cx('wrapper', 'login-page-container')} style={{minHeight: '100vh', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', width: '100%', maxWidth: 1100, margin: '0 auto', alignItems: 'center', justifyContent: 'center', gap: 32}}>
          <div className={cx('login-col-img')} style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className={cx('login-img-fluid')} alt="Sample" style={{maxWidth: 420, width: '100%'}} />
          </div>
          <div className={cx('login-col-form')} style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form className={cx('login', 'login-modern')} onSubmit={formik.handleSubmit} style={{marginTop: 0, boxShadow: '0 2px 16px rgba(25,118,210,0.10)', borderRadius: 16, padding: 32, minWidth: 340, background: '#fff'}}>
              <h2 className={cx('login-title-modern')} style={{fontWeight: 700, marginBottom: 16}}>Đăng nhập</h2>
              <div className={cx('login-social-section')}>
                <div className={cx('login-lead')}>Sign in with</div>
                <div className={cx('login-social-row')}>
                  <button type="button" className={cx('login-btn-social', 'facebook')}><FontAwesomeIcon icon={faFacebookF} /></button>
                  <button type="button" className={cx('login-btn-social', 'twitter')}><FontAwesomeIcon icon={faTwitter} /></button>
                  <button type="button" className={cx('login-btn-social', 'linkedin')}><FontAwesomeIcon icon={faLinkedinIn} /></button>
                  <button type="button" className={cx('login-btn-social', 'google')}><FontAwesomeIcon icon={faGoogle} /></button>
                </div>
              </div>
              <div className={cx('divider')} style={{display: 'flex', alignItems: 'center', margin: '18px 0'}}>
                <span style={{padding: '0 12px', color: '#888'}}>Or</span>
              </div>
              <div className={cx('group-control', 'login-form-outline')}>
                <Input className={cx('login-control', 'login-form-control')}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label className={cx('login-form-label')}>Username</label>
                {formik.errors.username && formik.touched.username ?
                  <Tippy content={formik.errors.username} placement={'bottom'} >
                    <i className={`fa-solid fa-circle-exclamation ${cx('icon-modifier')}`}></i>
                  </Tippy> : null
                }
              </div>
              <div className={cx('group-control', 'login-form-outline')}>
                <Input className={cx('login-control', 'login-form-control')}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label className={cx('login-form-label')}>Password</label>
                {formik.errors.password && formik.touched.password ?
                  <Tippy content={formik.errors.password} placement={'bottom'}>
                    <i className={`fa-solid fa-circle-exclamation ${cx('icon-modifier')}`}></i>
                  </Tippy> : null
                }
              </div>
              <div className={cx('login-form-check-row')} style={{marginBottom: 12}}>
                <div className={cx('login-form-check')}>
                  <input className={cx('login-form-check-input')} type="checkbox" id="rememberMe" />
                  <label className={cx('login-form-check-label')} htmlFor="rememberMe">Remember me</label>
                </div>
                <span
                  className={cx('login-forgot-link')}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/login/identify')}
                >
                  Forgot password?
                </span>
              </div>
              <div className={cx('login-btn-row')}>
                <button type="submit" className={cx('btn-login', 'login-btn-modern')}>Log in</button>
                <button className={cx('btn-signup', 'login-btn-modern')} type='button' onClick={handleOnclick}>Create new account</button>
              </div>
            </form>
          </div>
        </div>
        <footer className={cx('login-footer')} style={{marginTop: 24}}>
          <div className={cx('login-footer-left')}>
            Copyright © 2020. All rights reserved.
          </div>
          <div className={cx('login-footer-right')}>
            <a href="#" className={cx('login-footer-icon')}><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className={cx('login-footer-icon')}><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" className={cx('login-footer-icon')}><FontAwesomeIcon icon={faGoogle} /></a>
            <a href="#" className={cx('login-footer-icon')}><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
        </footer>
        {showFormSignup && <Signup setShowFormSignup={setShowFormSignup} />}
      </div>
    );
}

export default LoginSigup;