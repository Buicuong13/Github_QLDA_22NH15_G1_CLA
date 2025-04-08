import Main from '../pages/Main'
import LoginSignup from '../pages/LoginSignup'
import Album from '../pages/Album'
import AlbumDetail from '../pages/AlbumDetail'
import Home from '../pages/Home'
import Images from '../pages/Images'
import User from '../pages/User'
import Webcam from '../pages/Webcam'
import DeletedImages from '../pages/DeletedImages'
import ForgotPassword from '../pages/ForgotPassword'
import UpgradeCapacity from '../pages/UpgradeCapacity'
import UserManager from '../pages/Manager/User'
import CapacityManager from '../pages/Manager/Capacity'
import HistoryUpgradeManager from '../pages/Manager/HistoryUpgrade'

const routes = [
    {
        path: '/',
        component: Main,
        layout: 'MainLayout',
        isPrivate: false
    },
    {
        path: '/login',
        component: LoginSignup,
        layout: null,
        isPrivate: false
    },
    {
        path: '/login/identify',
        component: ForgotPassword,
        layout: null,
        isPrivate: false
    },
    {
        path: '/home',
        component: Home,
        isPrivate: true,
        role: 'rin2803911',
    },
    {
        path: '/webcam',
        component: Webcam,
        isPrivate: true,
        role: 'rin2803911',

    },
    {
        path: '/images',
        component: Images,
        isPrivate: true

    },
    {
        path: '/album',
        component: Album,
        isPrivate: true

    },
    {
        path: '/album/:id',
        component: AlbumDetail,
        isPrivate: true,
    },
    {
        path: '/deleted/images',
        component: DeletedImages,
        isPrivate: true
    },
    {
        path: '/user',
        component: User,
        isPrivate: true
    },
    {
        path: '/upgrade',
        component: UpgradeCapacity,
        layout: 'undefined',
        isPrivate: true
    },
    {
        path: '/manager/user',
        component: UserManager,
        isPrivate: true,
        permission: true,
    },
    {
        path: '/manager/capacity',
        component: CapacityManager,
        isPrivate: true,
        permission: true,
    },
    {
        path: '/manager/upgrade',
        component: HistoryUpgradeManager,
        isPrivate: true,
        permission: true,
    },
]

export default routes