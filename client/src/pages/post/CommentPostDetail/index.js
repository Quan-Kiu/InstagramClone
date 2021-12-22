import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './commentpostdetail.scss';
import { timeAgo } from '../../../utils/formatTime';
import { LikeIcon, UnlikeIcon, MoreIcon } from '../../../assets/icons/index';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../../../api/authApi';
import { useParams } from 'react-router';
import {
    getPostById,
    updateDetailPost,
    updatePost,
} from '../../../redux/reducer/postSlice';
import ReplyComment from '../ReplyComment';
import { createNotify } from '../../../redux/reducer/notifySlice';
import { Link } from 'react-router-dom';
import Settings from '../../../components/Settings';

const CommentPostDetail = ({ comment, handleReply, replyList }) => {
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const { postDetail } = useSelector((state) => state.post);
    const { action } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const dispatch = useDispatch();
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
            handle: () => handleDeleteComment(comment),
        },
        {
            path: '/',
            label: 'Hủy',
            handle: () => setIsMoreShow(false),
        },
    ];

    if (comment.user._id !== auth.user._id) {
        moreList.splice(1, 1);
    }

    const handleDeleteComment = async (cmt) => {
        try {
            await authApi.deleteData(`comment/${cmt._id}/delete`);

            const res = await dispatch(getPostById(action));
            socket.data.emit('deleteComment', res.payload.post);
            dispatch(updatePost(res.payload.post));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const isLiked = comment.likes.some(
            (item) => item._id === auth.user._id
        );
        setIsLiked(isLiked);
    }, [comment.likes, dispatch, auth.user._id]);

    const handleLikeComment = async (comment) => {
        authApi.patchData(`comment/${comment._id}/like`);
        const index = postDetail.comments.findIndex(
            (item) => item._id === comment._id
        );
        const newComment = { ...postDetail.comments[index] };
        newComment.likes = [...newComment.likes, auth.user];
        const newComments = [...postDetail.comments];
        newComments.splice(index, 1, newComment);
        socket.data.emit('likePost', {
            ...postDetail,
            comments: newComments,
        });
        if (newComment.user._id !== auth.user._id) {
            const notify = {
                id: postDetail._id,
                text: 'đã thích bình luận của bạn:',
                recipients: [comment.user._id],
                url: `post/${postDetail._id}?cmt=${comment._id}`,
                content: comment.content,
                image: postDetail.images[0].url,
            };
            await dispatch(createNotify(notify));
        }
        socket.data.emit('likeComment', comment.user._id);
        dispatch(updateDetailPost({ ...postDetail, comments: newComments }));
        dispatch(updatePost({ ...postDetail, comments: newComments }));
    };
    const handleUnlikeComment = (comment) => {
        authApi.patchData(`comment/${comment._id}/unlike`);
        const index = postDetail.comments.findIndex(
            (item) => item._id === comment._id
        );
        const newComment = { ...postDetail.comments[index] };
        const indexLike = newComment.likes.findIndex(
            (item) => item._id === auth.user._id
        );
        const newComments = [...postDetail.comments];
        const likes = [...newComment.likes];
        likes.splice(indexLike, 1);
        newComment.likes = likes;
        newComments.splice(index, 1, newComment);
        socket.data.emit('unlikePost', {
            ...postDetail,
            comments: newComments,
        });
        dispatch(updateDetailPost({ ...postDetail, comments: newComments }));
        dispatch(updatePost({ ...postDetail, comments: newComments }));
    };

    return (
        <div className="comment__item" id={comment._id}>
            {isMoreShow && (
                <Settings
                    data={moreList}
                    onCloseClick={() => setIsMoreShow(false)}
                />
            )}
            <img src={comment.user.avatar} alt="" className="avatar" />
            <div className="comment__content-center">
                <div className="content">
                    <Link to={`/profile?id=${comment.user._id}`}>
                        {comment.user.username}
                    </Link>
                    {comment.content}
                </div>
                <div className="interact">
                    <div className="createdat">
                        {timeAgo(comment.createdAt)}
                    </div>
                    {comment.likes.length > 0 && (
                        <div className="counter__like__comment">
                            {comment.likes.length} lượt thích
                        </div>
                    )}
                    <div
                        className="reply__comment"
                        onClick={() => handleReply(comment)}
                    >
                        Trả lời
                    </div>
                    <MoreIcon onClick={() => setIsMoreShow(true)} />
                </div>
                <ReplyComment
                    data={replyList}
                    handle={{
                        like: handleLikeComment,
                        unlike: handleUnlikeComment,
                        deleteReply: handleDeleteComment,
                    }}
                    handleReply={handleReply}
                    comment={comment}
                />
            </div>
            {isLiked ? (
                <UnlikeIcon
                    onClick={() => handleUnlikeComment(comment)}
                    className="like-comment-btn jello-horizontal"
                />
            ) : (
                <LikeIcon
                    onClick={() => handleLikeComment(comment)}
                    className="like-comment-btn"
                />
            )}
        </div>
    );
};

CommentPostDetail.propTypes = {
    comment: PropTypes.object,
};

CommentPostDetail.defaultProps = {
    comment: {},
};

export default CommentPostDetail;
