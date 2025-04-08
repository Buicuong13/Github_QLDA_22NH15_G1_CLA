import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ImageCardList.module.scss';
import ImageCard from '../ImageCard';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);
function ImageCardList({ images, displayAlbums, setDisplayAlbums, menuItems, isDeleting, handleCheckboxChange, listIdImgChecked, activeIndex, setActiveIndex }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageClicked, setIsImageClicked] = useState(false);
    const menuRef = useRef(null);
    // handle when we mousedown
    useEffect(() => {
        if (activeIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeIndex]);

    const handleCloseImage = () => {
        setSelectedImage(null);
        setIsImageClicked(false);
    };

    const handleImageClick = (imgElement) => {
        if (isDeleting) return;
        if (imgElement) {
            setSelectedImage(imgElement.src);
            setIsImageClicked(true);
        }
    };

    const handleOptionClick = (index) => {
        if (isDeleting) return;
        setActiveIndex(activeIndex === index ? null : index);
    };
    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setActiveIndex(null);
            setDisplayAlbums([]);
        }
    };
    // Các hàm handleDownloadImg, handleDeleteImg, handleShowListAlbumName sẽ được định nghĩa tương tự như trong component Images ban đầu
    return (
        <div className={cx('image-list')}>
            {isImageClicked && selectedImage && (
                <div className={cx('image-overlay')} onClick={handleCloseImage}>
                    <img src={selectedImage} alt="Selected" className={cx('full-screen-img')} />
                </div>
            )}
            {images.map((imgObj, index) => (
                <ImageCard
                    key={index}
                    imgObj={imgObj}
                    isChecked={listIdImgChecked.includes(imgObj.id)}
                    onCheckboxChange={(e) => handleCheckboxChange(e, imgObj)}
                    onImageClick={handleImageClick}
                    onOptionClick={() => handleOptionClick(index)}
                    isActive={activeIndex === index}
                    menuRef={menuRef}
                    MenuItems={menuItems}
                    displayAlbums={displayAlbums}
                    setDisplayAlbums={setDisplayAlbums}
                />
            ))}
        </div>
    );
}

export default ImageCardList;
