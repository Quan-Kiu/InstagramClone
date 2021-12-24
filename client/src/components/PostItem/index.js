import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateAuthUser } from '../../redux/reducer/authSlice';
import { createNotify } from '../../redux/reducer/notifySlice';
import {
    commnentPost,
    likePost,
    resetPostUser,
    savePost,
    unlikePost,
    unsavePost,
    updatePost,
} from '../../redux/reducer/postSlice';
import { timeAgo } from '../../utils/formatTime';
import CommentInput from '../CommentInput';
import CommentItem from '../CommentItem';
import InteractPost from '../InteractPost';
import PostHeading from '../PostHeading';
import Slice from '../Slice';
import './postitem.scss';

const PostItem = (props) => {
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const dispatch = useDispatch();
    const [readMore, setReadMore] = useState(false);

    const [indexImage, setIndexImage] = useState(0);
    const [isLiked, setIsLiked] = useState(() => {
        const isLiked = props.post.likes.some(
            (item) => item._id === auth.user._id
        );
        return isLiked;
    });
    const [isSaved, setIsSaved] = useState(() => {
        const isSaved = auth.user.saved.some(
            (item) => item._id === props.post._id
        );
        return isSaved;
    });

    const handleComment = async (commentText) => {
        const newComment = { postId: props.post._id, content: commentText };

        const res = await dispatch(commnentPost(newComment));
        if (res.payload.post.user._id !== auth.user._id) {
            const notify = {
                id: newComment.postId,
                text: 'đã bình luận bài viết của bạn:',
                recipients: [props.post.user._id],
                url: `post/${newComment.postId}?cmt=${res.payload.comment._id}`,
                content: newComment.content,
                image: props.post.images[0].url,
            };
            await dispatch(createNotify(notify));
        }
        socket.data.emit('commentPost', res.payload.post);
    };

    const handleInteractCommentItem = (comments) => {
        const newPost = { ...props.post, comments };

        dispatch(updatePost(newPost));
    };

    useEffect(() => {
        const liked = props.post.likes.some(
            (item) => item._id === auth.user._id
        );
        if (isLiked !== liked) {
            setIsLiked(liked);
        }
    }, [props.post.likes, auth.user._id, isLiked]);

    const handleLikePost = async (id) => {
        const action = likePost(id);
        dispatch(action);
        const newPost = {
            ...props.post,
            likes: [...props.post.likes, auth.user],
        };
        const notify = {
            id: newPost._id,
            text: 'đã thích bài viết của bạn.',
            recipients: [newPost.user._id],
            url: `post/${newPost._id}`,
            content: newPost.content,
            image: newPost.images[0].url,
        };
        dispatch(updatePost(newPost));
        await dispatch(createNotify(notify));
        socket.data.emit('likePost', newPost);
    };

    const handleUnlikePost = (id) => {
        const action = unlikePost(id);
        dispatch(action);
        const newLikes = [...props.post.likes];
        const index = newLikes.findIndex((item) => item._id === auth.user._id);
        newLikes.splice(index, 1);
        socket.data.emit('unlikePost', { ...props.post, likes: newLikes });
        dispatch(updatePost({ ...props.post, likes: newLikes }));
    };

    const handleSavePost = (id) => {
        const action = savePost(id);
        dispatch(action);
        const saved = [...auth.user.saved, { _id: id }];
        dispatch(resetPostUser('saved'));
        dispatch(updateAuthUser({ saved }));
        setIsSaved(true);
    };
    const handleUnsavePost = (id) => {
        const action = unsavePost(id);
        dispatch(action);
        const saved = auth.user.saved.filter((item) => item._id !== id);
        dispatch(resetPostUser('saved'));
        dispatch(updateAuthUser({ saved }));
        setIsSaved(false);
    };

    return (
        <div className="post__item">
            <PostHeading post={props.post} />
            <Slice images={props.post.images} handle={setIndexImage} />
            <div className="bottom-post">
                <InteractPost
                    handle={{
                        like: handleLikePost,
                        unlike: handleUnlikePost,
                        save: handleSavePost,
                        unsave: handleUnsavePost,
                    }}
                    isLiked={isLiked}
                    isSaved={isSaved}
                    showIndexImage={true}
                    post={props.post}
                    indexImage={indexImage}
                />

                {props.post.content && (
                    <>
                        <div className="content-post">
                            <Link to={`/profile?id=${props.post.user._id}`}>
                                {props.post.user.username}
                            </Link>
                            {readMore
                                ? props.post.content
                                : props.post.content.slice(
                                      0,
                                      props.post.content.indexOf('\n') >= 0
                                          ? props.post.content.indexOf('\n')
                                          : 20
                                  )}
                            {props.post.content.length > 20 ||
                                (props.post.content.includes('\n') &&
                                    !readMore && (
                                        <span
                                            className="readmore-btn"
                                            onClick={() => setReadMore(true)}
                                        >
                                            ... thêm
                                        </span>
                                    ))}
                        </div>
                    </>
                )}

                {props.post.comments.length > 2 && (
                    <Link
                        to={`post/${props.post._id}`}
                        className="view-all-comment"
                    >
                        Xem tất cả {props.post.comments.length} bình luận
                    </Link>
                )}
                {props.post.comments.length > 0 && (
                    <div className="comment">
                        {props.post.comments
                            .slice(
                                props.post.comments.length - 2,
                                props.post.comments.length
                            )
                            .map((comment, index) => (
                                <CommentItem
                                    key={index}
                                    post={props.post}
                                    handle={handleInteractCommentItem}
                                    comment={comment}
                                />
                            ))}
                    </div>
                )}

                <div className="createdat">
                    {timeAgo(props.post.createdAt, false)}
                </div>
                <CommentInput onComment={handleComment} />
            </div>
        </div>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostItem;
