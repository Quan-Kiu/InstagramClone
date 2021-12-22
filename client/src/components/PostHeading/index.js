import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { MoreIcon } from '../../assets/icons';
import { deletePost, resetPostUser } from '../../redux/reducer/postSlice';
import { follow, unFollow } from '../../redux/reducer/userSlice';
import BottomAlert from '../BottomAlert';
import Settings from '../Settings';
import './postheading.scss';

const PostHeading = ({ post, isDetailPage }) => {
    const [morePostShow, setMorePostShow] = useState(false);
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();
    const [isFollowing, setIsFollowing] = useState(false);

    const ConfirmList = [
        {
            label: 'Xoá',
            isDanger: true,
            path: 'delete',
            handle: async () => {
                try {
                    await dispatch(deletePost(post._id));
                    setMessage('Xóa bài viết thành công.');
                    socket.data.emit('deletePost', post);
                    if (isDetailPage) {
                        history.goBack();
                    }
                    dispatch(resetPostUser());
                } catch (error) {
                    setMessage(error.message);
                }
            },
        },
        {
            label: 'Hủy',
            path: '/',
            handle: () => setIsConfirmModalShow(false),
        },
    ];

    const MorePostList = [
        {
            label: 'Xóa',
            path: `/post/${post._id}/delete`,
            isDanger: true,
            handle: () => setIsConfirmModalShow(true),
        },
        {
            label: 'Báo cáo',
            path: `/post/${post._id}/report`,
            isDanger: true,
            handle: () => console.log('Báo'),
        },
        isFollowing
            ? {
                  label: 'Bỏ theo dõi',
                  path: `/unfollow`,
                  isDanger: true,
                  handle: () => handleUnfollow(post.user._id),
              }
            : {
                  label: 'Theo dõi',
                  path: `/follow`,
                  handle: () => handleFollow(post.user._id),
              },

        {
            label: 'Đi tới bài viết',
            path: `/post/${post._id}`,
        },

        {
            label: 'Chia sẻ lên...',
            path: `/post/${post._id}/share`,
            handle: () => console.log('share'),
        },
        {
            label: 'Sao chép liên kết',
            path: `/post/${post._id}/copy`,
            handle: () => console.log('Sao'),
        },
        {
            label: 'Hủy',
            path: `/`,
            handle: () => console.log('Hủy'),
        },
    ];

    if (isDetailPage) MorePostList.splice(3, 1);

    if (post.user._id !== auth.user._id) MorePostList.splice(0, 1);
    else MorePostList.splice(1, 2);

    useEffect(() => {
        auth.user.following.findIndex((item) => item._id === post.user._id) >= 0
            ? setIsFollowing(true)
            : setIsFollowing(false);
    }, [auth.user, post.user._id]);

    const handleFollow = (followId) => {
        dispatch(follow({ followId, user: auth.user }));
    };

    const handleUnfollow = (unFollowId) => {
        dispatch(unFollow({ unFollowId, user: auth.user }));
    };
    return (
        <>
            {message && (
                <BottomAlert handle={() => setMessage('')} text={message} />
            )}
            {morePostShow && (
                <Settings
                    data={MorePostList}
                    onCloseClick={() => setMorePostShow(false)}
                />
            )}
            {isConfirmModalShow && (
                <Settings
                    title="Xóa bài viết?"
                    subTitle="Bạn có chắc chắn muốn xóa bài viết này hay không?"
                    data={ConfirmList}
                    onCloseClick={() => setIsConfirmModalShow(false)}
                />
            )}
            <div className="heading d-flex justify-content-between align-items-center">
                <div className="actor">
                    <img src={post.user.avatar} alt={post.user.username} />

                    <Link to={`/profile?id=${post.user._id}`}>
                        {post.user.username}
                    </Link>
                    {isDetailPage &&
                        post.user._id !== auth.user._id &&
                        (isFollowing ? (
                            <span onClick={() => handleUnfollow(post.user._id)}>
                                <span className="dot">•</span>Bỏ theo dõi
                            </span>
                        ) : (
                            <span onClick={() => handleFollow(post.user._id)}>
                                <span className="dot">•</span>Theo dõi
                            </span>
                        ))}
                </div>
                <MoreIcon onClick={() => setMorePostShow(true)} />
            </div>
        </>
    );
};

PostHeading.propTypes = {
    post: PropTypes.object,
    isDetailPage: PropTypes.bool,
};

PostHeading.defaultProps = {
    post: {},
    isDetailPage: false,
};

export default PostHeading;
