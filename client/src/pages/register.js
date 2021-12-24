import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Forms/RegisterForm';
import Logo from '../components/Logo';
import { register } from '../redux/reducer/authSlice';
import '../scss/pages/register.scss';

const Register = (props) => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [alert, setAlert] = useState();
    const handleSubmitForm = async (values) => {
        const action = register(values);

        const res = await dispatch(action);
        if (res.error) {
            setAlert({ type: 'error', text: res.payload.message });
        } else {
            setAlert({ type: 'success', text: res.payload.message });
        }
    };

    return (
        <>
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
                        {alert && (
                            <div
                                className={`register-error ${
                                    alert.type === 'success'
                                        ? 'text-success'
                                        : 'text-danger'
                                }`}
                            >
                                {alert.text}
                            </div>
                        )}
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
