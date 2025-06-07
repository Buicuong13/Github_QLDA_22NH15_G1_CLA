import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./Navbar.module.scss";
import Button from "../Button";
import UpLoad from "../Upload";
import { authLogout } from "../../redux/actions/auth";
import * as userService from "../../services/userService.js";
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
    if (localStorage.getItem("authToken")) {
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
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenuItems]);

  return (
    <div className={cx("wrapper")}>
      <Link className={cx("logo")} to="../home"></Link>
      {children}
      {mainLayout && (
        <div className={cx("actions")}>
          <Button first to="/login">
            Log In
          </Button>
        </div>
      )}
      {defaultLayout && (
        <div className={cx("fix-toolbar")}>
          <div className={cx("actions")}>
            <Button
              className={cx("uploadButton")}
              onClick={() => setShowUpload(true)}
              icon={<i className="fa-solid fa-cloud-arrow-up" />}
              tooltip="Upload images"
            >
              Upload
            </Button>
          </div>

          <div className={cx("actions")}>
            <Button
              to="/user"
              className={cx("userUploadBtn")}
              icon={<i className="fa-solid fa-user-circle" style={{fontSize: 18, color: '#222', marginRight: 8}} />}
              tooltip={user?.name || "Account"}
              style={{background: 'none', boxShadow: 'none', color: '#222', border: 'none'}}
            >
              {user ? user.name : ""}
            </Button>
          </div>

          <div
            className={cx("option")}
            ref={menuRef}
            onClick={() => setShowMenuItems(!showMenuItems)}
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
            {showMenuItems && (
              <div className={cx("menu-items")}> 
                <Button
                  to="/scan-face"
                  four
                  className={cx('button', 'logout-fix')}
                  icon={<i className={`fa-solid fa-camera icon`} />}
                  tooltip="Scan khuôn mặt"
                >
                  <span style={{marginLeft: 10}}>ScanFace</span>
                </Button>
                <Button
                  to="/user"
                  four
                  className={cx('button', 'logout-fix')}
                  icon={<i className={`fa-solid fa-gear icon`} />}
                  tooltip="Cài đặt tài khoản"
                >
                  <span style={{marginLeft: 10}}>Settings</span>
                </Button>
                <Button
                  to="/deleted/images"
                  four
                  className={cx('button', 'logout-fix')}
                  icon={<i className={`fa-solid fa-trash icon`} />}
                  tooltip="Thùng rác"
                >
                  <span style={{marginLeft: 10}}>Recycle Bin</span>
                </Button>
                <Button
                  four
                  className={cx('button', 'logout-fix')}
                  onClick={() => dispatch(authLogout())}
                  icon={<i className={`fa-solid fa-right-from-bracket icon`} />}
                  tooltip="Đăng xuất"
                >
                  <span style={{marginLeft: 10}}>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {showUpload && <UpLoad setShowUpload={setShowUpload} />}
    </div>
  );
}

export default NavBar;
