import Webcam from 'react-webcam';
import classNames from 'classnames/bind';
import styles from './Camera.module.scss';
import Button from '../Button';
const cx = classNames.bind(styles);
function Camera({ setCapturedImage }) {
    const videoConstraints = {
        facingMode: "user"
    };
    // Hàm chuyển base64 thành Blob
    const base64ToBlob = (base64, type = 'image/jpeg') => {
        const byteString = atob(base64.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([uint8Array], { type });
    };
    return (
        <div className={cx('wrapper')}>
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            >
                {({ getScreenshot }) => (
                    <div className={cx('btn-modifier')}>
                        <Button
                            first
                            icon={<i className={`fa-solid fa-camera ${cx('icon-modifier')}`}></i>}
                            onClick={() => {
                                const imageSrc = getScreenshot({ width: 1280, height: 720 });
                                if (imageSrc) {
                                    // Chuyển đổi Base64 thành Blob
                                    const blob = base64ToBlob(imageSrc);
                                    setCapturedImage(blob); // Gửi Blob thay vì URL
                                }
                            }}
                        >
                            Take a photo
                        </Button>
                    </div>
                )}
            </Webcam>
        </div>
    );
}

export default Camera;
