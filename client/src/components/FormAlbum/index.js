import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import styles from './FormAlbum.module.scss';
import { v4 as uuidv4 } from 'uuid';
import Input from '../Input';
import Button from '../Button';
import * as AlbumService from '../../services/albumService';
const cx = classNames.bind(styles);

// ...existing code...
function FormAlbum({ title, setShowFormAlbum, albumDetail, isUpdate }) {
    const formik = useFormik({
        initialValues: {
            albumName: albumDetail?.albumName || '',
            description: albumDetail?.description || '',
            isPrivate: albumDetail?.isPrivate || false, // Thêm dòng này
        },
        validationSchema: Yup.object({
            albumName: Yup.string()
                .required('Album name is required')
                .min(3, 'Album name must be at least 3 characters'),
            description: Yup.string()
                .max(500, 'Description cannot exceed 500 characters'),
        }),
        onSubmit: async (values) => {
            if (!isUpdate) {
                const uniqueId = uuidv4();
                try {
                    await AlbumService.createAlbum({
                        albumName: values.albumName,
                        description: values.description,
                        location: uniqueId,
                        isPrivate: values.isPrivate, // Thêm dòng này
                    });
                    window.location.reload();
                } catch (error) {
                    formik.setFieldError('albumName', `${error.response.data.message}`);
                    console.error('Error creating album:', error);
                }
            }
            else {
                const updateAlbum = async () => {
                    const id = albumDetail.id;
                    const data = {
                        albumName: values.albumName,
                        description: values.description,
                        isPrivate: values.isPrivate, // Thêm dòng này
                    }
                    try {
                        await AlbumService.updateAlbum(id, data);
                        window.location.reload();
                    } catch (error) {
                        formik.setFieldError('albumName', error.response.data.message);
                        console.log(error);
                    }
                }
                updateAlbum();
            }
        },
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('form')}>
                <h2>{title}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        className={cx('album-control')}
                        type="text"
                        id="albumName"
                        name="albumName"
                        placeholder="Album Name"
                        autoComplete="albumName"
                        value={formik.values.albumName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.albumName && formik.errors.albumName && (
                        <p className={cx('message-error')}>{formik.errors.albumName}</p>
                    )}

                    <textarea
                        className={cx('txt-area')}
                        placeholder="Description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <p className={cx('message-error')}>{formik.errors.description}</p>
                    )}

                    {/* Thêm box bảo mật */}
                    <div className={cx('checkbox-row')}>
                        <input
                            type="checkbox"
                            id="isPrivate"
                            name="isPrivate"
                            checked={formik.values.isPrivate}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="isPrivate">Bảo mật</label>
                    </div>

                    <div>
                        <Button first onClick={() => setShowFormAlbum(false)} type="button">
                            Cancel
                        </Button>
                        <Button first type="submit">
                            {isUpdate ? "Update" : "Add"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormAlbum;
