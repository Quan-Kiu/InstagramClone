import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { timeAgo } from '../../utils/formatTime';
import { LikeIcon, MoreIcon, UnlikeIcon } from '../../assets/icons';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Settings from '../../components/Settings';

const ReplyCommentItem = (props) => {
    const auth = useSelector((state) => state.auth);
    const [isLiked, setIsLiked] = useState(false);
    const [isMoreShow, setIsMoreShow] = useState(false);

    const moreList = [
        {
            path: '/',
            isDanger: true,
            label: 'Báo cáo',
            handle: () => console.log('Báo'),
        },
        {
            path: '/',
            isDanger: true,
            label: 'Xóa',
            handle: () => props.handle.deleteReply(props.reply),
        },
        {
            path: '/',
            label: 'Hủy',
            handle: () => setIsMoreShow(false),
        },
    ];

    if (props.reply.user._id !== auth.user._id) {
        moreList.splice(1, 1);
    }

    useEffect(() => {
        const isLiked = props.reply.likes.some(
            (item) => item._id === auth.user._id
        );
        setIsLiked(isLiked);
    }, [props.reply.likes, auth.user._id]);
    return (
        <>
            {isMoreShow && (
                <Settings
                    data={moreList}
                    onCloseClick={() => setIsMoreShow(false)}
                />
            )}
            <div className="reply__item">
                <img src={props.reply.user.avatar} alt="" />
                <div className="reply__content">
                    <div className="content">
                        <Link
                            to={`/profile?id=${props.reply.user._id}`}
                            className="username"
                        >
                            {props.reply.user.username}
                        </Link>
                        {props.reply.content}
                    </div>
                    <div className="interact">
                        <div className="createdat">
                            {timeAgo(props.reply.createdAt)}
                        </div>
                        {props.reply.likes.length > 0 && (
                            <div className="counter__like__comment">
                                {props.reply.likes.length} lượt thích
                            </div>
                        )}

                        <div
                            className="reply__comment"
                            onClick={() =>
                                props.handleReply({
                                    ...props.reply,
                                    _id: props.reply.reply,
                                })
                            }
                        >
                            Trả lời
                        </div>
                        <MoreIcon onClick={() => setIsMoreShow(true)} />
                    </div>
                </div>
                {isLiked ? (
                    <UnlikeIcon
                        onClick={() => props.handle.unlike(props.reply)}
                        className="like-btn"
                    />
                ) : (
                    <LikeIcon
                        onClick={() => props.handle.like(props.reply)}
                        className="like-btn"
                    />
                )}
            </div>
        </>
    );
};

ReplyCommentItem.propTypes = {
    reply: PropTypes.object,
};

export default ReplyCommentItem;
