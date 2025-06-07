import { useNavigate } from "react-router-dom";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Album.module.scss";
import FormAlbum from "../../components/FormAlbum";
import { useAllAlbum } from "../../hooks/useAlbum";
import * as albumService from "../../services/albumService";
import FaceCamera from "../../components/Camera"; // Giả sử bạn đã có component này
import FaceDetection from "../../components/FaceDetection";
import FaceDetectionModal from '../../components/FaceDetection/FaceDetectionModal';
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
    // Tạo object chứa đầy đủ thông tin album
    const albumInfo = {
      id: obj.id,
      albumName: obj.albumName,
      description: obj.description,
      location: obj.location,
      // ... thêm các trường khác nếu cần
    };
    if (res.status === 403 && res.data?.requireFaceAuth) {
      // Nếu cần xác thực khuôn mặt, bật camera
      setShowFaceCam(true);
      setPendingAlbumId(obj.location);
      setPendingAlbumInfo(albumInfo); // Lưu lại thông tin album đầy đủ
    } else {
      // Nếu không bảo mật, chuyển trang như bình thường
      navigate(`/album/${obj.location}`, { state: { album: albumInfo } });
    }
  };

  // Hàm xử lý sau khi xác thực khuôn mặt thành công
  const handleFaceAuthSuccess = async () => {
    setShowFaceCam(false);
    if (pendingAlbumId && pendingAlbumInfo) {
      try {
        // Gọi API xác nhận xác thực khuôn mặt trước
        await albumService.confirmFaceAuth(pendingAlbumId);
        // Sau đó mới gọi lại API lấy chi tiết album
        const res = await albumService.showAlbumDetail(pendingAlbumId);
        if (res.status === 200 && res.data) {
          navigate(`/album/${pendingAlbumId}`, { state: { album: res.data } });
        } else {
          navigate(`/album/${pendingAlbumId}`, { state: { album: pendingAlbumInfo } });
        }
      } catch (err) {
        navigate(`/album/${pendingAlbumId}`, { state: { album: pendingAlbumInfo } });
      }
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
      {/* Hiển thị camera xác thực khuôn mặt ở dạng modal */}
      <FaceDetectionModal open={showFaceCam} onClose={() => setShowFaceCam(false)}>
        <FaceDetection onSuccess={handleFaceAuthSuccess} />
      </FaceDetectionModal>
    </div>
  );
}

export default Album;
