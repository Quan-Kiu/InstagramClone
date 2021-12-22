import { FastField, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';
import * as Yup from 'yup';
import InputField from '../../custom-field/InputField';

const LoginForm = (props) => {
    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email không được để trống'),

        password: Yup.string()
            .required('This field is required')
            .min(5)
            .max(25),
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
                            placeholder="Email"
                        />
                        <FastField
                            name="password"
                            component={InputField}
                            placeholder="Mật khẩu"
                            type="password"
                        />

                        <Button type="submit">Đăng nhập</Button>
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
