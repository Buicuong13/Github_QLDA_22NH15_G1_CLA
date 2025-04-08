import classNames from "classnames/bind";
import styles from './Menu.module.scss';
import Button from "../Button";
import * as AlbumImageService from '../../services/albumImageService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
const cx = classNames.bind(styles);
function Menu({ ImageObj, MenuItems, displayAlbums, setDisplayAlbums }) {
    const [isBack, setIsBack] = useState(true);
    const current = displayAlbums.length > 0 ? displayAlbums : MenuItems;
    const handleAddImgToAlbum = (e, AlbumObj, ImageObj) => {
        e.stopPropagation();
        const addImgToAblum = async () => {
            const data = {
                albumId: AlbumObj.id,
                imageId: ImageObj.id,
            }
            try {
                setIsBack(false);
                const res = await AlbumImageService.addImgToAlbum(data);
                toast.success(`Success:${res.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                    onClose: () => setIsBack(true),
                });
            } catch (error) {
                console.log(error);
                toast.error(`Error:${error.response.data.message}`, {
                    position: "bottom-center",
                    autoClose: 1000,
                });
            }
        }
        addImgToAblum();
    }

    return (
        <div className={cx('wrapper')}>
            {displayAlbums.length > 0 && (
                <Button four icon={<i className="fa-solid fa-arrow-left"></i>} className={cx('modifier')} onClick={(e) => {
                    e.stopPropagation();
                    if (isBack) {
                        setDisplayAlbums([]);
                    }
                }}>
                    Back
                </Button>
            )}
            {current.map((item, index) => (
                item.id ? (
                    <Button key={index} four onClick={(e) => handleAddImgToAlbum(e, item, ImageObj)}>
                        {item.albumName}

                    </Button>
                ) : (
                    <Button key={index} four icon={<i className={`${item.icon} ${cx('icon-modifier')}`}></i>} onClick={(e) => item.handleOnclick(ImageObj, e)}>
                        {item.name}
                    </Button>
                )
            ))}
            <ToastContainer />

        </div>
    );
}

export default Menu;
