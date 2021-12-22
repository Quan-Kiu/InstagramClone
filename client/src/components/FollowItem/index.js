import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import './followitem.scss';
import { Link } from 'react-router-dom';
import { follow, unFollow } from '../../redux/reducer/userSlice';
import { Spinner } from 'reactstrap';

const FollowItem = (props) => {
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const dispatch = useDispatch();
    const { follower } = props;
    const followed = auth.user.following.some(
        (user) => user._id === follower._id
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleOnFollow = async (followId) => {
        setIsLoading(true);
        await dispatch(
            follow({ followId, user: auth.user, socket: socket.data })
        );
    };
    const handleOnUnFollow = async (unFollowId) => {
        setIsLoading(true);
        await dispatch(unFollow({ unFollowId, user: auth.user }));
    };

    useEffect(() => {
        setIsLoading(false);
    }, [followed]);
    return (
        <div className={`${props.className} follow-list__item d-flex px-4`}>
            <img
                className="follow-list__item-avatar"
                src={follower.avatar}
                alt=""
            />
            <div className="follow-list__item__infos">
                <Link
                    to={`/profile?id=${follower._id}`}
                    className="follow-list__item__infos-username"
                >
                    {follower.username}
                </Link>
                <p className="follow-list__item__infos-fullname mb-0">
                    {follower.fullname}
                </p>
            </div>
            {auth.user._id === follower._id ? (
                <Button
                    className="btn-follow"
                    path="/profile"
                    handle={props.onCloseClick}
                    children="Truy cập"
                />
            ) : followed ? (
                <Button
                    className="btn-follow"
                    children={
                        isLoading ? (
                            <Spinner
                                animation="border"
                                size="md"
                                variant="secondary"
                                children=""
                            />
                        ) : (
                            'Bỏ theo dõi'
                        )
                    }
                    handle={() => handleOnUnFollow(follower._id)}
                />
            ) : (
                <Button
                    className="btn-follow btn-primary opacity-75"
                    children={
                        isLoading ? (
                            <Spinner
                                animation="border"
                                size="md"
                                variant="secondary"
                                children=""
                            />
                        ) : (
                            'Theo dõi'
                        )
                    }
                    handle={() => handleOnFollow(follower._id)}
                />
            )}
        </div>
    );
};

FollowItem.propTypes = {
    follower: PropTypes.object.isRequired,
    className: PropTypes.string,
};

FollowItem.defaultProps = {
    className: '',
};

export default FollowItem;
