import React, { useState } from 'react';
import * as ImageService from '../../services/imageService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageCardList from '../../components/ImageCardList';
import Toolbar from '../../components/Toolbar';
import useImages from '../../hooks/useImages';
import { useAllAlbum } from '../../hooks/useAlbum';
function Images() {
    // hooks
    const { img, setImg } = useImages();
    const { albums } = useAllAlbum();
    const [isHideAlbum, setIsHideAlbum] = useState(false);
    const [listIdImgChecked, setListIdImgChecked] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayAlbums, setDisplayAlbums] = useState([])
    const [activeIndex, setActiveIndex] = useState(null);
    // function handle of MenuItems
    const handleShowListAlbumName = async (obj, e) => {
        if (isDeleting) return;
        e.stopPropagation();
        if (!albums || albums.length === 0) return;
        const newItems = albums.map(item => ({
            id: item.id,
            userId: item.userId,
            albumName: item.albumName,
            description: item.description,
            location: item.location,
            createdAt: item.createdAt,
        }));
        setDisplayAlbums(prev => [...prev, ...newItems]);
    };

    const handleDownloadImg = async (ImageObj) => {
        if (isDeleting) return;
        const url = ImageObj.url;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'demo.jpg';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };
    const handleDeleteImg = async (ImageObj, e) => {
        if (isDeleting) return;
        e.stopPropagation();
        setIsDeleting(true);
        setActiveIndex(null);
        // document.removeEventListener('mousedown', handleClickOutside);
        const idImg = ImageObj.id;
        const fetchData = async () => {
            try {
                await ImageService.deleteImage(idImg);
                setImg((prev) => prev.filter((img) => img.id !== idImg));
                setIsDeleting(false);
            } catch (error) {
                console.error(error);
                toast.error(`Error:${error.response.data.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
            }
        }
        fetchData();
    };

    const MenuItems = [
        {
            icon: 'fa-solid fa-folder',
            name: 'Add To Album',
            handleOnclick: handleShowListAlbumName
        },
        {
            icon: 'fa-solid fa-download',
            name: 'Download',
            handleOnclick: handleDownloadImg
        },
        {
            icon: 'fa-solid fa-trash',
            name: 'Delete',
            handleOnclick: handleDeleteImg
        }
    ];

    // function handle of menuToolbar
    const handleShowAlbum = (e) => {
        setIsHideAlbum(!isHideAlbum);
    }

    const handleDeleteMutipleImg = (e) => {
        const fetchData = async () => {
            try {
                const res = await ImageService.deleteMultipleImage(listIdImgChecked);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
                setIsHideAlbum(false);
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
            icon: 'fa-solid fa-folder',
            handleOnclick: handleShowAlbum
        },
        {
            icon: 'fa-solid fa-trash',
            handleOnclick: handleDeleteMutipleImg
        }
    ];

    const handleOnclickCheckbox = (e, obj) => {
        if (listIdImgChecked.length === 0) {
            setIsHideAlbum(false);
        }
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
    return (
        <>
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
                    isAlbumListVisible={isHideAlbum}
                    menuToolbar={menuToolbar}
                    listIdImgChecked={listIdImgChecked}
                />
            }
            <ToastContainer />

        </>


    );
}

export default Images;