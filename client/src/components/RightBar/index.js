import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createNotify } from '../../redux/reducer/notifySlice';
import { follow, unFollow } from '../../redux/reducer/userSlice';
import FollowItem from '../FollowItem';
import Footer from '../Footer';
import Loading1 from '../Loading1';
import './rightbar.scss';

const RightBar = (props) => {
    const user = useSelector((state) => state.user);
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const dispatch = useDispatch();

    const handleFollow = async (followId) => {
        const action = follow({ followId, user: auth.user });
        const notify = {
            id: auth.user._id,
            text: 'đã theo dõi bạn.',
            recipients: [followId],
            content: '',
            url: `profile?id=${auth.user._id}`,
            image: '',
        };

        dispatch(action);
        await dispatch(createNotify(notify));
        socket.data.emit('followUser', followId);
    };

    const handleUnfollow = async (unFollowId) => {
        const action = unFollow({ unFollowId, user: auth.user });
        await dispatch(action);
    };
    return (
        <div className="right-bar">
            <div className="right-bar__content">
                <div className="account d-flex  align-items-center">
                    <img
                        src={auth.user.avatar}
                        alt=""
                        className="account__avatar"
                    />
                    <div className="account__infos">
                        <div className="username">{auth.user.username}</div>
                        <div className="fullname">{auth.user.fullname}</div>
                    </div>
                    <Link to="/profile" className="visit-profile">
                        Đi đến
                    </Link>
                </div>
                <div className="suggest">
                    <div className="title d-flex justify-content-between align-items-center">
                        <span>Gợi ý cho bạn</span>
                        <Link to="/suggestions">Xem tất cả</Link>
                    </div>
                    {user.suggestions.loading && (
                        <div className="text-center">
                            <Loading1 />
                        </div>
                    )}
                    <div className="suggest__list">
                        {user.suggestions.users.length > 0 &&
                            user.suggestions.users
                                .filter((item, index) => index < 5)
                                .map((item, index) => (
                                    <FollowItem
                                        key={index}
                                        follower={item}
                                        handle={{
                                            onFollow: handleFollow,
                                            onUnfollow: handleUnfollow,
                                        }}
                                    />
                                ))}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

RightBar.propTypes = {};

export default RightBar;
