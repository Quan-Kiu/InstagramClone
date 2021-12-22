import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import LoginForm from '../components/Forms/LoginForm';
import Loading from '../components/Loading';
import Logo from '../components/Logo';
import { DISPLAY_PHONE_SLIDE } from '../constants/slide';
import { handleFailed, handleSuccess, login } from '../redux/reducer/authSlice';
import '../scss/pages/login.scss';

const Login = () => {
    const [active, setActive] = useState(0);
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const history = useHistory();

    useEffect(() => {
        const updateDisplayPhone = setInterval(() => {
            if (active === 4) setActive(0);
            else {
                const nextDisplayPhone = active + 1;
                setActive(nextDisplayPhone);
            }
        }, 6000);
        return () => {
            clearInterval(updateDisplayPhone);
        };
    }, [active]);

    const handleSubmit = (values) => {
        const action = login(values);
        dispatch(action);
        history.push('/');
    };

    const handleCloseClick = () => {
        if (auth.error) dispatch(handleFailed());
        else {
            dispatch(handleSuccess());
        }
    };

    return (
        <>
            {auth.loading && <Loading homeLoading={true} />}
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
            <div className="login">
                <div className="login__media">
                    <div className="phone-image">
                        <img
                            className="phone"
                            src="/assets/images/login/phone.png"
                            alt=""
                        />
                        {DISPLAY_PHONE_SLIDE.map((item, index) => (
                            <img
                                key={index}
                                className={
                                    active === index
                                        ? 'display active'
                                        : 'display'
                                }
                                src={item.src}
                                alt="phone"
                            />
                        ))}
                    </div>
                </div>
                <div className="login__content">
                    <div className="login__content__form">
                        <Logo />
                        <LoginForm onSubmit={handleSubmit} />
                    </div>
                    <div className="not-account">
                        <p>
                            Bạn chưa có tài khoản ư?{' '}
                            <Link to="/register" style={{ fontWeight: 'bold' }}>
                                Đăng ký
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

Login.propTypes = {};

export default Login;
