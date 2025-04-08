import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './DeletedImages.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as deletedImgService from '../../services/deletedImgService';
import ImageCardList from '../../components/ImageCardList';
import Toolbar from '../../components/Toolbar';
import useDeletedImages from '../../hooks/useDeletedImages';

const cx = classNames.bind(styles);

function DeletedImages() {
    const { deletedImg, setDeleteImg } = useDeletedImages();
    const [listIdImgChecked, setListIdImgChecked] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayAlbums, setDisplayAlbums] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleRestore = (objDeletedImage, e) => {
        if (isDeleting) return;
        e.stopPropagation();
        setIsDeleting(true);
        // document.removeEventListener('mousedown', handleClickOutside);
        const id = objDeletedImage.id;
        const restoreImg = async () => {
            try {
                const res = await deletedImgService.restoreDeletedImage(id);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 500,
                    onClose: () => {

                        window.location.reload();
                    },
                });
            } catch (error) {
                console.log(error);
                toast.success(`Error:${error.respone.data.message}`, {
                    position: "bottom-center",
                    autoClose: 500,
                });
            }
        }
        restoreImg();
    }
    const handleDeleteImg = (objDeletedImage, e) => {
        if (isDeleting) return;
        e.stopPropagation();
        setIsDeleting(true);
        // document.removeEventListener('mousedown', handleClickOutside);
        const id = objDeletedImage.id;
        const removeImg = async () => {
            try {
                const res = await deletedImgService.removeDeletedImage(id);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 500,
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } catch (error) {
                console.log(error)
            }
        }
        removeImg();
    }
    const MenuItems = [
        {
            name: 'Restore',
            icon: 'fa-solid fa-arrows-rotate',
            handleOnclick: handleRestore
        },
        {
            name: 'Delete',
            icon: 'fa-solid fa-trash',
            handleOnclick: handleDeleteImg
        }
    ];

    const handleRestoneMulitple = (e) => {
        const fetchData = async () => {
            try {
                const res = await deletedImgService.restoreMultipleDeletedImage(listIdImgChecked);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
                setListIdImgChecked([]);
                setDeleteImg((prev) => prev.filter((deleteImg) => !listIdImgChecked.includes(deleteImg.id)));
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

    const handleDelMulitple = (e) => {
        const fetchData = async () => {
            try {
                const res = await deletedImgService.removeMultipleDeletedImage(listIdImgChecked);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
                setListIdImgChecked([]);
                setDeleteImg((prev) => prev.filter((deleteImg) => !listIdImgChecked.includes(deleteImg.id)));
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
            icon: 'fa-solid fa-arrows-rotate',
            handleOnclick: handleRestoneMulitple
        },
        {
            icon: 'fa-solid fa-trash',
            handleOnclick: handleDelMulitple
        }
    ];
    ////////////////////////////////////////
    const handleOnclickCheckbox = (e, deletedImage) => {
        setListIdImgChecked((pre) => {
            const isChecked = listIdImgChecked.includes(deletedImage.id);
            if (isChecked) {
                return listIdImgChecked.filter(item => item !== deletedImage.id);
            }
            else {
                return [...pre, deletedImage.id]
            }
        });
    }

    return (
        <div className={cx('wrapper')}>
            <ImageCardList
                images={deletedImg}
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
            <ToastContainer />
        </div>
    );
}

export default DeletedImages;