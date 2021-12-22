import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { LikeIcon, UnlikeIcon } from '../../assets/icons';
import { createNotify } from '../../redux/reducer/notifySlice';
import './commentitem.scss';

const CommentItem = ({ comment, handle, post }) => {
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const [isLiked, setIsLiked] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const isLiked = comment.likes.some(
            (item) => item._id === auth.user._id
        );
        setIsLiked(isLiked);
    }, [comment.likes, auth.user._id]);

    const handleLikeComment = async () => {
        authApi.patchData(`comment/${comment._id}/like`);
        const index = post.comments.findIndex(
            (item) => item._id === comment._id
        );
        const newComment = { ...post.comments[index] };
        newComment.likes = [...newComment.likes, auth.user];
        const newComments = [...post.comments];
        newComments.splice(index, 1, newComment);
        handle(newComments);
        if (newComment.user._id !== auth.user._id) {
            const notify = {
                id: post._id,
                text: 'đã thích bình luận của bạn:',
                recipients: [comment.user._id],
                url: `post/${post._id}?cmt=${comment._id}`,
                content: comment.content,
                image: post.images[0].url,
            };
            await dispatch(createNotify(notify));
            socket.data.emit('likeComment', comment.user._id);
        }
    };
    const handleUnlikeComment = () => {
        authApi.patchData(`comment/${comment._id}/unlike`);
        const index = post.comments.findIndex(
            (item) => item._id === comment._id
        );
        const newComment = { ...post.comments[index] };
        const indexLike = newComment.likes.findIndex(
            (item) => item._id === auth.user._id
        );
        const newComments = [...post.comments];
        const likes = [...newComment.likes];
        likes.splice(indexLike, 1);
        newComment.likes = likes;
        newComments.splice(index, 1, newComment);
        handle(newComments);
    };
    return (
        <div className="comment__item d-flex align-items-center justify-content-between">
            <Link to={`/profile?id=${comment.user._id}`} className="commenter">
                {comment.user.username}
            </Link>
            <div className="content">{comment.content}</div>
            {isLiked ? (
                <UnlikeIcon onClick={handleUnlikeComment} />
            ) : (
                <LikeIcon onClick={handleLikeComment} />
            )}
        </div>
    );
};

CommentItem.propTypes = {
    comment: PropTypes.object,
};

CommentItem.defaultProps = {
    comments: {},
};

export default CommentItem;
