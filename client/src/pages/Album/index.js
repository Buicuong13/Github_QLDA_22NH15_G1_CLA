import classNames from 'classnames/bind';
import styles from './Album.module.scss';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import FormAlbum from '../../components/FormAlbum';
import { useAllAlbum } from '../../hooks/useAlbum';
const cx = classNames.bind(styles);
function Album() {
    const { albums } = useAllAlbum();
    const [showformAlbum, setShowFormAlbum] = useState(false);
    const navigate = useNavigate();
    const handleOnclickDirect = (e, obj) => {
        navigate(`/album/${obj.location}`)
    }

    return (
        <div className={cx('wrapper')}>
            {albums.map((obj) => (
                <div key={obj.id} className={cx('card')} onClick={(e) => { handleOnclickDirect(e, obj) }}>
                    <h3 className={cx('card-title')}>{obj.albumName}</h3>
                    <p className={cx('card-description')}>{obj.description}</p>
                </div>
            ))}
            <i className={`fa-solid fa-plus ${cx('card', 'card-bonus')}`} onClick={() => setShowFormAlbum(!showformAlbum)}></i>
            {showformAlbum && <FormAlbum title={'ADD NEW ALBUM'} setShowFormAlbum={setShowFormAlbum} />}
        </div >
    );
}

export default Album;
