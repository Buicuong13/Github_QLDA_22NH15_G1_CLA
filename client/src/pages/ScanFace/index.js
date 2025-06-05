import classNames from "classnames/bind";
import styles from "./ScanFace.module.scss";
import FaceScan from "../../components/FaceScan";
const cx = classNames.bind(styles);

function ScanFace() {
  return (
    <div className={cx("wrapper")}>
      <FaceScan />
    </div>
  );
}

export default ScanFace;
