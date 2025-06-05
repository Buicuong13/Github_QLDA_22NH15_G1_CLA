import { useNavigate } from "react-router-dom";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Album.module.scss";
import FormAlbum from "../../components/FormAlbum";
import { useAllAlbum } from "../../hooks/useAlbum";
import * as albumService from "../../services/albumService";
import FaceCamera from "../../components/Camera"; // Giả sử bạn đã có component này
import FaceDetection from "../../components/FaceDetection";
const cx = classNames.bind(styles);

function Album() {
  const { albums } = useAllAlbum();
  const [showformAlbum, setShowFormAlbum] = useState(false);
  const [showFaceCam, setShowFaceCam] = useState(false);
  const [pendingAlbumId, setPendingAlbumId] = useState(null);
  const [pendingAlbumInfo, setPendingAlbumInfo] = useState(null);
  const navigate = useNavigate();

  const handleOnclickDirect = async (e, obj) => {
    // Gọi API lấy chi tiết album
    const res = await albumService.showAlbumDetail(obj.location);
    if (res.status === 403 && res.data?.requireFaceAuth) {
      // Nếu cần xác thực khuôn mặt, bật camera
      setShowFaceCam(true);
      setPendingAlbumId(obj.location);
      setPendingAlbumInfo(obj); // Lưu lại thông tin album ban đầu
    } else {
      // Nếu không bảo mật, chuyển trang như bình thường
      navigate(`/album/${obj.location}`, { state: { album: obj } });
    }
  };

  // Hàm xử lý sau khi xác thực khuôn mặt thành công
  const handleFaceAuthSuccess = () => {
    setShowFaceCam(false);
    if (pendingAlbumId && pendingAlbumInfo) {
      navigate(`/album/${pendingAlbumId}`, { state: { album: pendingAlbumInfo } });
    }
  };

  return (
    <div className={cx("wrapper")}>
      {albums.map((obj) => (
        <div
          key={obj.id}
          className={cx("card")}
          onClick={(e) => {
            handleOnclickDirect(e, obj);
          }}
        >
          <h3 className={cx("card-title")}>{obj.albumName}</h3>
          <p className={cx("card-description")}>{obj.description}</p>
        </div>
      ))}
      <i
        className={`fa-solid fa-plus ${cx("card", "card-bonus")}`}
        onClick={() => setShowFormAlbum(!showformAlbum)}
      ></i>
      {showformAlbum && (
        <FormAlbum
          title={"ADD NEW ALBUM"}
          setShowFormAlbum={setShowFormAlbum}
        />
      )}
      {/* {showFaceCam && <FaceCamera onSuccess={handleFaceAuthSuccess} />} */}
      {showFaceCam && <FaceDetection onSuccess={handleFaceAuthSuccess} />}
    </div>
  );
}

export default Album;
