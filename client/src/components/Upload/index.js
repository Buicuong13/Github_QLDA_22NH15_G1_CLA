import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import Button from '../Button';
import * as ImageService from '../../services/imageService';
const cx = classNames.bind(styles);

function UpLoad({ setShowUpload }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const displayFileNameRef = useRef('');
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleUpload = async () => {
        if (!selectedFiles.length) return;
        setUploadProgress(0);
        const CLOUD_NAME = 'dt3gvugaf';
        const PRESET_NAME = 'demo-upload';
        const FOLDER_NAME = 'Demo';
        const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        let uploadedUrls = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', PRESET_NAME);
            formData.append('folder', FOLDER_NAME);

            try {
                const response = await axios.post(api, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            ((i + progressEvent.loaded / progressEvent.total) / selectedFiles.length) * 100
                        );
                        setUploadProgress(progress);
                    },
                });
                uploadedUrls.push(response.data.secure_url);
            } catch (error) {
                toast.error(`Upload failed: ${file.name}`);
            }
        }

        if (uploadedUrls.length) {
            try {
                await ImageService.createMultipleImages(uploadedUrls);
                toast.success('Upload thành công!');
                window.location.reload();
            } catch (error) {
                toast.error('Lưu ảnh vào hệ thống thất bại!');
            }
        }
        setSelectedFiles([]);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        displayFileNameRef.current = files.map(f => f.name).join(', ');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('block', { show: isVisible })}>
                <h2 className={cx('title')}>Upload Image</h2>
                <div className={cx('wrapper-button')}>
                    <Button five onClick={() => fileInputRef.current.click()} className={cx('btn')}>
                        Select From Device
                    </Button>
                </div>
                <div className={cx('form')}>
                    <input
                        type="text"
                        className={cx('input')}
                        placeholder="Selected file(s) or paste URL here..."
                        value={selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : displayFileNameRef.current}
                        readOnly
                    />
                    <Button
                        five
                        onClick={handleUpload}
                        className={cx('btn', { disabled: !selectedFiles.length })}
                        disabled={!selectedFiles.length}
                    >
                        Upload
                    </Button>
                </div>
                {uploadProgress > 0 && (
                    <div className={cx('progress-bar')}>
                        <div
                            className={cx('progress')}
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple // Cho phép chọn nhiều file bằng Ctrl
                />
                <i
                    className={`fa-regular fa-circle-xmark ${cx('icon-modifier')}`}
                    onClick={() => setShowUpload(false)}
                />
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpLoad;