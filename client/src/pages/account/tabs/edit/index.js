import { FastField, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Spinner } from 'reactstrap';
import * as Yup from 'yup';
import { authApi } from '../../../../api/authApi';
import FileInputField from '../../../../custom-field/FileInputField';
import InputField from '../../../../custom-field/InputField';
import { setAlert } from '../../../../redux/reducer/alertSlice';
import { update } from '../../../../redux/reducer/authSlice';
import { checkImage, uploadImage } from '../../../../utils/handleImageUpload';
import './edit.scss';

const Edit = (props) => {
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(loading);

    const initialValues = {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        story: user.story,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
    };

    const validationSchema = Yup.object().shape({
        fullname: Yup.string()
            .required('Tên không được để trống')
            .max(30)
            .min(5),
        email: Yup.string()
            .required('Email không được để trống.')
            .email('Vui lòng nhập đúng email.')
            .max(50),
        story: Yup.string().max(200),
    });

    const handleFileInputChange = async (e) => {
        setIsLoading(true);
        const file = e.target.files[0];
        const err = checkImage(file);
        if (!err) {
            const data = await uploadImage([file]);
            if (data) {
                try {
                    await authApi.patchData('user/changeavatar', {
                        newAvatar: data[0],
                    });

                    const action = update(user._id);
                    dispatch(action);
                } catch (error) {
                    dispatch(
                        setAlert({
                            type: 'bottomAlert',
                            text: error.response.data.message,
                        })
                    );
                }
            }
        } else {
            dispatch(setAlert({ type: 'bottomAlert', text: err }));
        }
        setIsLoading(false);
    };

    const handleSubmitForm = async (values) => {
        try {
            await authApi.patchData('user/updateuser', {
                newValues: values,
            });
            const action = update(user._id);
            dispatch(action);
            dispatch(
                setAlert({ type: 'bottomAlert', text: 'Đã lưu trang cá nhân' })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: 'bottomAlert',
                    text: error.response.data.message,
                })
            );
        }
    };
    return (
        <>
            <div className="tab-edit">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {(form) => {
                        return (
                            <Form>
                                <FileInputField
                                    name="avatarfile"
                                    other={{ username: user.username }}
                                    onInputChange={handleFileInputChange}
                                    label={
                                        isLoading || loading ? (
                                            <Spinner
                                                animation="border"
                                                size="md"
                                                variant="secondary"
                                                children=""
                                            />
                                        ) : (
                                            <img
                                                alt={user.username}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                }}
                                                src={user.avatar}
                                            />
                                        )
                                    }
                                />
                                <FastField
                                    name="fullname"
                                    component={InputField}
                                    placeholder={user.fullname}
                                    label="Tên"
                                    subinput={
                                        <p>
                                            Hãy lấy tên mà bạn thường dùng để
                                            tài khoản của bạn dễ tìm thấy hơn.
                                            Đó có thể là tên đầy đủ, biệt danh
                                            hoặc tên doanh nghiệp.
                                        </p>
                                    }
                                />
                                <FastField
                                    name="username"
                                    component={InputField}
                                    placeholder={user.username}
                                    label="Tên người dùng"
                                    disabled={true}
                                    subinput={
                                        <p>
                                            Thông thường, bạn sẽ có thể đổi lại
                                            tên người dùng về {user.username}{' '}
                                            sau 14 ngày nữa.
                                            <a href="/test">Tìm hiểu thêm</a>
                                        </p>
                                    }
                                />

                                <FastField
                                    name="story"
                                    component={InputField}
                                    placeholder={user.story}
                                    label="Tiểu sử"
                                    type="textarea"
                                    subinput={
                                        <div className="mt-5">
                                            <b style={{ fontSize: '13px' }}>
                                                Thông tin cá nhân
                                            </b>
                                            <p>
                                                Cung cấp thông tin cá nhân của
                                                bạn, bất kể bạn dùng tài khoản
                                                cho doanh nghiệp, thú cưng hay
                                                gì khác. Thông tin này sẽ không
                                                hiển thị trên trang cá nhân công
                                                khai của bạn.
                                            </p>
                                        </div>
                                    }
                                />

                                <FastField
                                    name="email"
                                    type="email"
                                    component={InputField}
                                    placeholder={user.email}
                                    label="Email"
                                />

                                <FastField
                                    name="gender"
                                    type="select"
                                    label="Giới tính"
                                    component={InputField}
                                    children={
                                        <>
                                            <option>Nam</option>
                                            <option>Nữ</option>
                                            <option>Khác</option>
                                            <option>Không muốn tiết lộ</option>
                                        </>
                                    }
                                />

                                <FastField
                                    name="mobile"
                                    component={InputField}
                                    placeholder={user.mobile}
                                    label="Số điện thoại"
                                    subinput={
                                        <div
                                            className="mt-4 text-primary fw-bold user-select-none"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                dispatch(
                                                    setAlert({
                                                        type: 'bottomAlert',
                                                        text: 'Chức năng đang được xây dựng.',
                                                    })
                                                );
                                            }}
                                        >
                                            Tạm thời vô hiệu hóa tài khoản
                                        </div>
                                    }
                                />

                                <FormGroup>
                                    <label></label>
                                    <Button
                                        disabled={!form.dirty}
                                        style={{
                                            backgroundColor: '#B2DFFC',
                                            border: 'none',
                                            minWidth: '5rem',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                        }}
                                        type="submit"
                                    >
                                        {loading ? (
                                            <Spinner
                                                animation="border"
                                                size="md"
                                                variant="secondary"
                                                children=""
                                            />
                                        ) : (
                                            'Gửi'
                                        )}
                                    </Button>
                                </FormGroup>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </>
    );
};

export default Edit;
