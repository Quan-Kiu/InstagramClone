import React from 'react';
import PropTypes from 'prop-types';
import { FastField, Form, Formik } from 'formik';
import InputField from '../../custom-field/InputField';
import { Button, Spinner } from 'reactstrap';
import * as Yup from 'yup';

const RegisterForm = (props) => {
    const initialValues = {
        email: '',
        fullname: '',
        username: '',
        password: '',
    };
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email không được để trống'),
        fullname: Yup.string()
            .required('Tên đầy đủ không được để trống')
            .min(5)
            .max(30),
        username: Yup.string()
            .required('Tên người dùng không được để trống')
            .min(5)
            .max(25),
        password: Yup.string().required('Mật khẩu không được để trống').min(6),
    });
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={props.onSubmit}
        >
            {() => {
                return (
                    <Form>
                        <FastField
                            name="email"
                            type="email"
                            component={InputField}
                            placeholder="Nhập Email"
                        />

                        <FastField
                            name="fullname"
                            component={InputField}
                            placeholder="Nhập tên đầy đủ"
                        />
                        <FastField
                            name="username"
                            component={InputField}
                            placeholder="Nhập tên người dùng"
                        />
                        <FastField
                            name="password"
                            component={InputField}
                            type="password"
                            placeholder="Nhập mật khẩu"
                        />
                        <Button type="submit">
                            {props.loading ? (
                                <Spinner
                                    animation="border"
                                    size="md"
                                    variant="secondary"
                                    children=""
                                />
                            ) : (
                                'Đăng ký'
                            )}
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
};

RegisterForm.propTypes = {
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,
};
RegisterForm.defaultProps = {
    onSubmit: null,
    loading: false,
};
export default RegisterForm;
