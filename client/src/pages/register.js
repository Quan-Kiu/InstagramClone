import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import RegisterForm from '../components/Forms/RegisterForm';
import Logo from '../components/Logo';
import {
    handleFailed,
    handleSuccess,
    register,
} from '../redux/reducer/authSlice';

import { setAlert } from '../redux/reducer/alertSlice';
import '../scss/pages/register.scss';

const Register = (props) => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const handleSubmitForm = (values) => {
        const action = register(values);
        dispatch(action);
    };
    const history = useHistory();

    useEffect(() => {
        if (auth.token) {
            history.push('/');
        }
    }, [auth.token, history]);

    const handleCloseClick = () => {
        if (auth.error) dispatch(handleFailed());
        else {
            dispatch(handleSuccess());
        }
    };

    return (
        <>
            {auth.error && (
                <Alert
                    onCloseClick={handleCloseClick}
                    title="Error"
                    bg="bg-danger"
                    message={auth.error}
                />
            )}
            {auth.success && (
                <Alert
                    onCloseClick={handleCloseClick}
                    title="Success"
                    bg="bg-success"
                    message={auth.success}
                />
            )}
            <div className="register">
                <div className="register__content">
                    <div className="register__content__form">
                        <Logo />
                        <div className="register__content__sub-logo text-gray opacity-75">
                            Đăng ký để xem ảnh và video từ bạn bè.
                        </div>
                        <button
                            className="btn-login-fb btn btn-primary text-white mt-4 mb-4"
                            onClick={() =>
                                dispatch(
                                    setAlert({
                                        type: 'bottomAlert',
                                        text: 'Chức năng đang xây dựng.',
                                    })
                                )
                            }
                        >
                            Đăng nhập bằng Facebook
                        </button>
                        <div className="hr mb-4 opacity-75">
                            <span>Hoặc</span>
                        </div>
                        <RegisterForm
                            onSubmit={handleSubmitForm}
                            loading={auth.loading}
                        />
                        <div className="rules opacity-75">
                            Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính
                            sách dữ liệu và Chính sách cookie của chúng tôi.
                        </div>
                    </div>
                    <div className="has-account">
                        <p>
                            Bạn có tài khoản?{' '}
                            <Link to="/login" style={{ fontWeight: 'bold' }}>
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
