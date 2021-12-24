import { FastField, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Spinner } from 'reactstrap';
import * as Yup from 'yup';
import InputField from '../../custom-field/InputField';
import { useSelector } from 'react-redux';

const LoginForm = (props) => {
    const auth = useSelector((state) => state.auth);
    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email không được để trống'),

        password: Yup.string()
            .required('Password không được để trống.')
            .min(6, 'Mật khẩu ít nhất 6 ký tư.'),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={props.onSubmit}
        >
            {(form) => {
                return (
                    <Form>
                        <FastField
                            name="email"
                            type="email"
                            component={InputField}
                            placeholder="Email"
                        />
                        <FastField
                            name="password"
                            component={InputField}
                            placeholder="Mật khẩu"
                            type="password"
                        />

                        <Button
                            disabled={!form.isValid || !form.dirty}
                            type="submit"
                        >
                            {auth.login.loading ? (
                                <Spinner
                                    animation="border"
                                    size="md"
                                    variant="secondary"
                                    children=""
                                />
                            ) : (
                                'Đăng nhập'
                            )}
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func,
};
LoginForm.defaultProps = {
    onSubmit: null,
};

export default LoginForm;
