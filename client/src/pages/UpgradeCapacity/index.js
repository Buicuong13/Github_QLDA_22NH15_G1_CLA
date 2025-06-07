import classnames from 'classnames/bind';
import styles from './UpgradeCapacity.module.scss';
import * as historyUpgradeService from '../../services/historyUpgrade';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button'
import { useHistoryUpgradeSuccess } from '../../hooks/useHistoryUpgrade';
import { useAllCapacityPackage } from '../../hooks/useCapacity';
import { Link } from 'react-router-dom';

const cx = classnames.bind(styles);
function UpgradeCapacity() {
    const { upgradeSucess } = useHistoryUpgradeSuccess();
    const { capacityPackages } = useAllCapacityPackage();
    const sizeCapacityUpgraded = [];

    upgradeSucess.forEach((item) => {
        sizeCapacityUpgraded.push(item.size);
    })

    const handleOnclick = (e, item) => {
        const data = {
            capacityPackageId: item.id,
        }
        const fetchData = async () => {
            try {
                const res = await historyUpgradeService.createHistoryUpgrade(data);
                toast.success(`Success:${res.message}`, {
                    position: 'bottom-center',
                    autoClose: 1000,
                })
            } catch (error) {
                console.log(error);
                toast.error(`Error:${error.response.data.message}`, {
                    position: 'bottom-center',
                    autoClose: 1000,
                })
            }
        }
        fetchData();
    }
    return (
        <div className={cx('wrapper')}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginTop: 24, marginBottom: 8, position: 'relative', zIndex: 2, paddingLeft: 48, minWidth: 240 }}>
                <Link to="/home" style={{ textDecoration: 'none' }}>
                    <Button first className={cx('back-btn-upgrade')}>
                        Back to Home
                    </Button>
                </Link>
            </div>
            <div className={cx('block')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                {
                    capacityPackages && capacityPackages.map((item, index) => {
                        return <div className={cx('card')} key={index}>
                            <h3 className={cx('heading-title')}>{item.name}</h3>
                            <h3 className={cx('heading-title')}>{item.size}MB</h3>
                            <h1 className={cx('heading-price')}>{item.price}$</h1>
                            <span>{item.description}</span>
                            {
                                Math.max(...sizeCapacityUpgraded) >= item.size
                                    ? <Button first disabled className={cx('btn-disabled')} >Select</Button>
                                    : <Button first onClick={(e) => handleOnclick(e, item)}>Select</Button>
                            }
                        </div>
                    })
                }
            </div>
            <ToastContainer />
        </div>)
        ;
}

export default UpgradeCapacity;