import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Toolbar.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import * as AlbumService from '../../services/albumService';
import * as AlbumImageService from '../../services/albumImageService';
import Button from '../../components/Button';
const cx = classNames.bind(styles);
function Toolbar({ isAlbumListVisible, menuToolbar, listIdImgChecked }) {
    const [listAlbum, setListAlbum] = useState([]);
    useEffect(() => {
        if (isAlbumListVisible) {
            const showAlbum = async () => {
                try {
                    const res = await AlbumService.showAllAlbums();
                    setListAlbum(res.data);
                } catch (error) {
                    console.log(error);
                }
            };
            showAlbum();
        }
    }, [isAlbumListVisible])

    const onAddImagesToAlbum = (e, albumObj) => {
        const data = {
            albumId: albumObj.id,
            listImageId: listIdImgChecked,
        }
        const fetchData = async () => {
            try {
                const res = await AlbumImageService.addMultipleImgToAlbum(data);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
                // setIsHideAlbum(false);
                // setListIdImgChecked([]);
            } catch (error) {
                toast.success(`Error:${error.response.data.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
            }
        }
        fetchData();
    }

    return (
        <div className={cx('block')}>
            <div className={cx('toolbar')}>
                {menuToolbar.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            second
                            icon={<i className={item.icon}></i>}
                            onClick={item.handleOnclick}
                        />
                    );
                })}

                {isAlbumListVisible && (
                    <ul className={cx('list')}>
                        {listAlbum.map((item) => (
                            <li
                                key={item.id}
                                className={cx('list-item')}
                                onClick={(e) => onAddImagesToAlbum(e, item)}
                            >
                                {item.albumName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Toolbar;
