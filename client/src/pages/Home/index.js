import React, { useRef, useEffect, useState } from 'react';
import * as ImageService from '../../services/imageService';
import * as DeletedImgService from '../../services/deletedImgService';
import * as userService from '../../services/userService'
import Button from '../../components/Button';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Chart from '../../components/Chart'
import useImages from '../../hooks/useImages';
import Slider from '../../components/Slider';
const cx = classNames.bind(styles);

function Home() {
    const { img } = useImages();
    const [capacity, setCapacity] = useState({
        used: 0,
        total: 0,
    });
    const progress = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await ImageService.showAllImages();
                const totalSize1 = res1.data.reduce((sum, obj) => sum + obj.fileSize, 0);
                const res2 = await DeletedImgService.showDeletedImages();
                const totalSize2 = res2.data.reduce((sum, obj) => sum + obj.fileSize, 0);
                const totalSize = (totalSize1 + totalSize2) / 1024;
                const res = await userService.getUser();
                const storage = res.capacity;
                setCapacity({
                    used: totalSize.toFixed(2),
                    total: storage,
                });
                const usagePercentage = (totalSize.toFixed(2) / storage) * 100; // Giả sử 1MB là dung lượng tối đa
                if (progress.current) {
                    progress.current.style.width = `${usagePercentage}%`;
                    progress.current.textContent = `${usagePercentage.toFixed(2)}%`;
                    progress.current.classList.remove(cx('green'), cx('red'));
                    if (usagePercentage <= 70) {
                        progress.current.classList.add(cx('green'));
                    } else {
                        progress.current.classList.add(cx('red'));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Slider />
            <Chart type={'ImageChart'} items={img} />
            <div className={cx('block')}>
                <div className={cx('storage-info')}>
                    <h2 className={cx('title')}>Storage Usage</h2>
                    <p>Storage used: {capacity.used}MB of {capacity.total}MB</p>
                    <div className={cx('progress-container')}>
                        <div className={cx('progress-bar')} ref={progress}></div>
                    </div>
                    <Button to="/upgrade" four className={cx('btn-upgrade')}>Upgrade</Button>
                </div>
            </div>
        </div>
    );
}

export default Home;
