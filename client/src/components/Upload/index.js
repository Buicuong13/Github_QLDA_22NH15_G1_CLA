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
    const [selectedFile, setSelectedFile] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const displayFileNameRef = useRef('');
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleUpload = async () => {
        setSelectedFile(null);
        const CLOUD_NAME = 'dt3gvugaf';
        const PRESET_NAME = 'demo-upload';
        const FOLDER_NAME = 'Demo';
        const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', PRESET_NAME);
        formData.append('folder', FOLDER_NAME);

        try {
            const response = await axios.post(api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                },
            });
            await ImageService.createImage({
                url: response.data.secure_url,
            });
            window.location.reload();
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error(`Error: ${error.response?.data?.message || 'Upload failed'}`, {
                position: "bottom-center",
                autoClose: 3000,
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            displayFileNameRef.current = file;
        }
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
                        placeholder="Selected file or paste URL here..."
                        value={selectedFile ? selectedFile.name : displayFileNameRef.current.name}
                        readOnly
                    />
                    <Button
                        five
                        onClick={handleUpload}
                        className={cx('btn', { disabled: !selectedFile })}
                        disabled={!selectedFile}
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