import { FastField, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup } from 'reactstrap';
import * as Yup from 'yup';
import { authApi } from '../../../../api/authApi';
import InputField from '../../../../custom-field/InputField';
import { setAlert } from '../../../../redux/reducer/alertSlice';
import './password.scss';

const Password = (props) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const initialValues = {
        oldPassword: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .required('Mật khẩu cũ không được để trống.')
            .trim('Không được sử dụng dấu khoảng trắng.')
            .max(30)
            .min(6),
        password: Yup.string()
            .min(6)
            .when('oldPassword', (oldPassword, field) =>
                oldPassword
                    ? field.required('Mật khẩu không được để trống.')
                    : field
            ),
        confirmPassword: Yup.string().when('password', (password, field) =>
            password
                ? field
                      .required('Vui lòng xác nhận mật khẩu.')
                      .oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp')
                : field
        ),
    });

    const handleSubmitForm = async (values) => {
        try {
            const res = await authApi.patchData('user/changepassword', values);
            dispatch(setAlert({ type: 'bottomAlert', text: res.message }));
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
        <div className="password-change">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitForm}
            >
                {(form) => {
                    return (
                        <Form>
                            <FormGroup className="mb-5">
                                <label>
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
                                </label>
                                <div
                                    className="input top-50 d-flex align-items-center"
                                    style={{
                                        fontSize: '1.8rem',
                                        fontWeight: '500',
                                    }}
                                >
                                    {user.username}
                                </div>
                            </FormGroup>

                            <FastField
                                name="oldPassword"
                                component={InputField}
                                type="password"
                                label="Mật khẩu cũ"
                            />
                            <FastField
                                name="password"
                                component={InputField}
                                type="password"
                                label="Mật khẩu mới"
                            />
                            <FastField
                                name="confirmPassword"
                                component={InputField}
                                type="password"
                                label="Xác nhận mật khẩu mới"
                            />

                            <FormGroup>
                                <label></label>
                                <Button
                                    disabled={!form.dirty}
                                    style={{
                                        backgroundColor: '#B2DFFC',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}
                                    type="submit"
                                >
                                    Đổi mật khẩu
                                </Button>
                            </FormGroup>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default Password;
