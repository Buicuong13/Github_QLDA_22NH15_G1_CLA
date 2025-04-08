import { useState } from "react";
import classNames from "classnames/bind";
import styles from './Header.module.scss';
import FormAlbum from '../../../components/FormAlbum';
import dayjs from 'dayjs';
const cx = classNames.bind(styles)

function Header({ setShowFormConfirm, album }) {
    const [fixAlbum, setFixAlbum] = useState(false);

    return (<div className={cx('wrapper')}>
        {fixAlbum && <FormAlbum title={'Update Album'} setShowFormAlbum={setFixAlbum} albumDetail={album} isUpdate />}
        {album && (
            <div className={cx('block')}>
                <div className={cx('title')}>
                    <>
                        <h2 className={cx('heading')}>{album.albumName}</h2>
                        <span>{album.description}</span>
                        <span> Created on {dayjs(album.createdAt).format('DD/MM/YYYY')}</span>
                    </>

                </div>
                <div className={cx('icon')} onClick={() => {
                    setFixAlbum(true)
                }}>
                    <i className="fa-solid fa-pen" ></i>
                </div>
                <div className={cx('icon1')} onClick={() => {
                    setShowFormConfirm(true)
                }}>
                    <i className="fa-solid fa-trash"></i>
                </div>
            </div>
        )}
    </div>);
}

export default Header;