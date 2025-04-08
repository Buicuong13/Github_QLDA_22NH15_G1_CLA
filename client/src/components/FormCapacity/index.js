import React from 'react';
import classNames from 'classnames/bind';
import styles from './FormCapacity.module.scss';
import Input from '../Input';
import Button from '../Button';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as capacityPackageService from '../../services/capacityPackageService';
import * as Yup from 'yup';
const cx = classNames.bind(styles);
function FormCapacity({ title, handleUnmount, capacityDetail, isUpdate }) {
    const text = title.split(' ')[0];
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(3, 'Album name must be at least 3 characters'),
        size: Yup.number()
            .typeError('Size must be a number')
            .required('Size is required')
            .positive('Size must be greater than 0')
            .integer('Size must be an integer'),
        description: Yup.string()
            .required('Description is required')
            .max(500, 'Description cannot exceed 500 characters'),
        price: Yup.number()
            .typeError('Price must be a number')
            .required('Price is required')
            .positive('Price must be greater than 0')
    });
    const formik = useFormik({
        initialValues: {
            name: capacityDetail.name || '',
            size: capacityDetail.size || '',
            description: capacityDetail.description || '',
            price: capacityDetail.price || '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const idPackage = capacityDetail.id;
            const data = {
                name: values.name,
                size: parseInt(values.size),
                description: values.description,
                price: parseInt(values.price),
            }
            if (isUpdate) {
                updatCapacity(idPackage, data);
            } else {
                addCapacity(data);
            }
        },
    });
    const addCapacity = async (data) => {
        try {
            await capacityPackageService.createCapacityPackage(data);
            window.location.reload();
        } catch (error) {
            console.log(error);
            toast.error(`Error:${error.response.data.message}`, {
                position: "bottom-center",
                autoClose: 1000,
            })
        }
    }
    const updatCapacity = async (idPackage, data) => {
        try {
            await capacityPackageService.updateCapacityPackage(idPackage, data);
            window.location.reload();
        } catch (error) {
            console.log(error);
            toast.error(`Error:${error.response.data.message}`, {
                position: "bottom-center",
                autoClose: 1000,
            })
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('block')}>
                <h2 className={cx('heading')}>{title}</h2>
                <form onSubmit={formik.handleSubmit} className={cx('form')}>
                    <div>
                        <Input
                            className={cx('album-control')}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            autoComplete="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className={cx('message-error')}>{formik.errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            className={cx('album-control')}
                            type="text"
                            id="size"
                            name="size"
                            placeholder="Size"
                            autoComplete="size"
                            value={formik.values.size}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.size && formik.errors.size && (
                            <p className={cx('message-error')}>{formik.errors.size}</p>
                        )}
                    </div>
                    <div>
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
                    </div>
                    <div>
                        <Input
                            className={cx('album-control')}
                            type="text"
                            id="price"
                            name="price"
                            placeholder="Price"
                            autoComplete="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className={cx('message-error')}>{formik.errors.price}</p>
                        )}
                    </div>
                    <div>
                        <Button first onClick={() => handleUnmount()} type="button">
                            Cancel
                        </Button>
                        <Button first type="submit">
                            {text}
                        </Button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
export default FormCapacity;