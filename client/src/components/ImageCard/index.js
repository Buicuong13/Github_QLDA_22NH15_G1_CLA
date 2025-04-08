import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ImageCard.module.scss';
import Input from '../Input';
import Menu from '../Menu';

const cx = classNames.bind(styles);

function ImageCard({ imgObj, isActive, isChecked, onImageClick, onOptionClick, onCheckboxChange, menuRef, MenuItems, displayAlbums, setDisplayAlbums }) {
    const imgRef = useRef(null);

    return (
        <div className={cx('wrapper')}>
            <img
                ref={imgRef}
                src={imgObj.url}
                className={cx('img')}
                alt="img"
                onClick={() => onImageClick(imgRef.current)}
            />
            <div className={cx('block-option')} ref={isActive ? menuRef : null}>
                <i
                    className={`fa-solid fa-bars ${cx('icon-modifier')}`}
                    onClick={onOptionClick}
                >
                    {isActive && (
                        <Menu
                            ImageObj={imgObj}
                            MenuItems={MenuItems}
                            displayAlbums={displayAlbums}
                            setDisplayAlbums={setDisplayAlbums}
                        />
                    )}
                </i>
            </div>
            <Input
                type="checkbox"
                className={cx('modifier-btn-checkbox')}
                onChange={onCheckboxChange}
                checked={isChecked}
            />
        </div>
    );
};


export default ImageCard;

