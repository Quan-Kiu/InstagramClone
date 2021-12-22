import React, { useState } from 'react';
import {
    DirectIcon,
    HomeIcon,
    CreatePostIcon,
    ExploreIcon,
    LikeIcon,
    UnlikeIcon,
} from '../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { Container } from 'reactstrap';
import { logout } from '../../redux/reducer/authSlice';
import Dropdown from '../Dropdown';
import Logo from '../Logo';
import './header.scss';
import Search from '../Search';
import NewPost from '../NewPost';
import Notify from '../Notify';

const Header = (props) => {
    const auth = useSelector((state) => state.auth);
    const alert = useSelector((state) => state.alert);
    const notify = useSelector((state) => state.notify);
    const message = useSelector((state) => state.message);

    const { pathname } = useLocation();
    const [isNewPostShow, setIsNewPostShow] = useState(false);
    const [isNotifyShow, setIsNotifyShow] = useState(false);
    const dispatch = useDispatch();
    const handleLogout = () => {
        const action = logout();
        dispatch(action);
    };

    const navLinks = [
        {
            label: 'Home',
            icon: <HomeIcon />,
            path: '/',
        },
        {
            label: 'Message',
            icon: <DirectIcon />,
            path: '/message/inbox',
        },
        {
            label: 'AddPost',
            icon: <CreatePostIcon />,
            path: '/create',
            handle: (e) => {
                e.preventDefault();
                setIsNewPostShow(true);
            },
        },
        {
            label: 'Explore',
            icon: <ExploreIcon />,
            path: '/explore',
        },

        {
            label: 'Notify',
            icon: <LikeIcon />,
            path: '/notify',
            handle: (e) => {
                e.preventDefault();
                setIsNotifyShow(true);
            },
        },
    ];
    return (
        <header className="header">
            {isNewPostShow && (
                <NewPost onClose={() => setIsNewPostShow(false)} />
            )}
            <Container>
                <nav className="d-flex justify-content-between align-items-center">
                    <Logo />
                    <Search />
                    <ul className="nav-bar d-flex align-items-center">
                        {navLinks.map((link, index) => (
                            <li className={`nav-item`} key={index}>
                                <Link
                                    onClick={link.handle}
                                    className={`nav-link ${
                                        link.path === pathname ? 'active' : ''
                                    }`}
                                    to={link.path}
                                >
                                    {link.icon}
                                </Link>
                                {link.label === 'Message' &&
                                    message.conversations.unreadCount > 0 && (
                                        <Link
                                            to={link.path}
                                            className="message__unread-count"
                                        >
                                            {message.conversations.unreadCount}
                                        </Link>
                                    )}
                                {link.label === 'Home' &&
                                    alert.newPostAlert && (
                                        <div className="dot">.</div>
                                    )}
                                {link.label === 'Notify' &&
                                    notify.countIsRead > 0 && (
                                        <>
                                            <div className="dot">.</div>
                                            <div className="card">
                                                <UnlikeIcon />
                                                {notify.countIsRead}
                                            </div>
                                        </>
                                    )}
                                {link.label === 'Notify' && isNotifyShow && (
                                    <Notify
                                        onClose={() => setIsNotifyShow(false)}
                                    />
                                )}
                            </li>
                        ))}
                        <Dropdown
                            image={auth.user.avatar}
                            onLogout={handleLogout}
                        />
                    </ul>
                </nav>
            </Container>
        </header>
    );
};

Header.propTypes = {};

export default Header;
