import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './AlbumDetail.module.scss';
import Button from '../../components/Button';
import FormConfirm from '../../components/FormConfirm';
import * as AlbumService from '../../services/albumService';
import * as AlbumImageService from '../../services/albumImageService';

import { useParams, useLocation } from 'react-router-dom';
import Header from './Header';
import ImageCardList from '../../components/ImageCardList';
import Toolbar from '../../components/Toolbar';
import { useAlbumDetail } from '../../hooks/useAlbum';
import { useImagesByAlbumId } from '../../hooks/useAlbumImage';
import { useAllAlbum } from '../../hooks/useAlbum';
const cx = classNames.bind(styles);
function AlbumDetail() {
    const { id } = useParams();
    const location = useLocation();
    // Lấy album từ state nếu có (khi navigate từ xác thực khuôn mặt)
    const albumFromState = location.state?.album;
    const { albumDetail } = useAlbumDetail(id);
    const album = albumFromState || albumDetail;
    const { img, setImg } = useImagesByAlbumId(id);
    const { albums } = useAllAlbum();
    const [displayAlbums, setDisplayAlbums] = useState([]);
    const [listIdImgChecked, setListIdImgChecked] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showFormConfirm, setShowFormConfirm] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleDownloadImg = async (ImageObj, e) => {
        if (isDeleting) return;
        e.stopPropagation();
        const url = ImageObj.url;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'image.jpg';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    }

    const handleDeleteImg = (ImageObj, e) => {
        console.log(ImageObj.id);
        if (isDeleting) return;
        e.stopPropagation();
        setIsDeleting(true);
        const idAlbumImg = ImageObj.id;
        const deleteImgFromAlbum = async () => {
            try {
                await AlbumImageService.deleteImgFromAlbum(idAlbumImg);
                setImg((prev) => prev.filter((img) => img.id !== idAlbumImg));
                setActiveIndex(null);
                setIsDeleting(false);
            } catch (error) {
                console.log(error);
                toast.error(`Error:${error.respone.data.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
            }
        }
        deleteImgFromAlbum();
    }

    const handleDeleteAlbum = (e) => {
        const deleteAlbum = async () => {
            let id = albumDetail?.id;
            let locationKey = albumDetail?.location;
            // Nếu không có location, lấy từ useParams.id (URL)
            if (!locationKey && id) {
                locationKey = id; // id ở đây là useParams.id (location)
            }
            if (!id && !locationKey && typeof window !== 'undefined') {
                // fallback: lấy từ URL cuối cùng
                const pathParts = window.location.pathname.split('/');
                locationKey = pathParts[pathParts.length - 1];
            }
            // Tìm id số trong albums theo location
            if (!id && locationKey && albums && albums.length > 0) {
                let found = albums.find(a => a.location === locationKey);
                if (!found && albumDetail?.albumName) {
                    found = albums.find(a => a.albumName === albumDetail.albumName);
                }
                id = found?.id;
            }
            console.log('DEBUG - albumDetail:', albumDetail);
            console.log('DEBUG - albums:', albums);
            console.log('DEBUG - locationKey:', locationKey);
            console.log('DEBUG - id gửi lên xóa:', id);
            if (!id) {
                toast.error('Không xác định được id album để xóa!');
                return;
            }
            try {
                await AlbumService.deleteAlbum(id);
                window.location.href = "/album"
            } catch (error) {
                console.log(error);
            }
        }
        deleteAlbum();
    }

    const MenuItems = [
        {
            name: 'Download',
            icon: 'fa-solid fa-download',
            handleOnclick: handleDownloadImg
        },
        {
            name: 'Delete',
            icon: 'fa-solid fa-trash',
            handleOnclick: handleDeleteImg
        }
    ];

    const handleDeleteMutipleImgFromAlbum = (e) => {
        const fetchData = async () => {
            try {
                const res = await AlbumImageService.deleteMultipleImgFromAlbum(listIdImgChecked);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
                setListIdImgChecked([]);
                setImg((prev) => prev.filter((img) => !listIdImgChecked.includes(img.id)));
            } catch (error) {
                console.log(error);
                toast.success(`Error:${error.response.data.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
            }
        }
        fetchData();
    }

    const menuToolbar = [
        {
            icon: 'fa-solid fa-trash',
            handleOnclick: handleDeleteMutipleImgFromAlbum
        }
    ];
    //////////////////////////////////
    const handleOnclickCheckbox = (e, obj) => {
        setListIdImgChecked((pre) => {
            const isChecked = listIdImgChecked.includes(obj.id);
            if (isChecked) {
                return listIdImgChecked.filter(item => item !== obj.id);
            }
            else {
                return [...pre, obj.id]
            }
        });
    }
    // Nếu album chưa có (null) thì show loading hoặc album không tồn tại
    if (!album) {
        return <div className={cx('wrapper')}>Loading album...</div>;
    }
    return (
        <div className={cx('wrapper')}>
            <Header setShowFormConfirm={setShowFormConfirm} album={album} />
            <ImageCardList
                images={img}
                displayAlbums={displayAlbums}
                setDisplayAlbums={setDisplayAlbums}
                menuItems={MenuItems}
                isDeleting={isDeleting}
                handleCheckboxChange={handleOnclickCheckbox}
                listIdImgChecked={listIdImgChecked}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
            />
            {
                listIdImgChecked.length > 0 &&
                <Toolbar
                    menuToolbar={menuToolbar}
                    listIdImgChecked={listIdImgChecked}
                />
            }
            {showFormConfirm && (
                <FormConfirm title={"Confirm"} content={"Do you want to delete this album?"}>
                    <div className={cx('modal-buttons')}>
                        <Button first onClick={() => setShowFormConfirm(false)} className={cx('btn-cancel')}>Cancel</Button>
                        <Button first onClick={(e) => handleDeleteAlbum(e)} className={cx('btn-delete')}>Delete</Button>
                    </div>
                </FormConfirm>
            )
            }
            <ToastContainer />

        </div >
    );
}

export default AlbumDetail;
