import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommentInput from '../../../components/CommentInput';
import InteractPost from '../../../components/InteractPost';
import { updateAuthUser } from '../../../redux/reducer/authSlice';
import { createNotify } from '../../../redux/reducer/notifySlice';
import {
    likePost,
    resetPostUser,
    savePost,
    unlikePost,
    unsavePost,
    updateDetailPost,
    updatePost,
} from '../../../redux/reducer/postSlice';
import { timeAgo } from '../../../utils/formatTime';
import './postdetailbottom.scss';

const PostDetailBottom = ({ post, handleComment, onReply }) => {
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const postDetail = useSelector((state) => state.post.postDetail);
    const [isLiked, setIsLiked] = useState(() => {
        const liked = post.likes.some((item) => item._id === auth.user._id);
        return liked;
    });
    const [isSaved, setIsSaved] = useState(() => {
        const saved = auth.user.saved.some((item) => item._id === post._id);
        return saved;
    });
    const [isFollowing, setIsFollowing] = useState(true);

    const dispatch = useDispatch();
    useEffect(() => {
        if (auth.user._id !== post.user._id) {
            auth.user.following.findIndex(
                (item) => item._id === post.user._id
            ) >= 0
                ? setIsFollowing(true)
                : setIsFollowing(false);
        }
    }, [auth.user, post.user._id]);

    useEffect(() => {
        const liked = post.likes.some((item) => item._id === auth.user._id);
        setIsLiked(liked);
    }, [post.likes, auth.user._id]);

    const handleLike = async (id) => {
        const action = likePost(id);
        dispatch(action);
        const newPost = {
            ...postDetail,
            likes: [...postDetail.likes, auth.user],
        };
        dispatch(updateDetailPost(newPost));
        dispatch(updatePost(newPost));
        const notify = {
            id: newPost._id,
            text: 'đã thích bài viết của bạn.',
            recipients: [newPost.user._id],
            url: `post/${newPost._id}`,
            content: newPost.content,
            image: newPost.images[0].url,
        };
        await dispatch(createNotify(notify));
        socket.data.emit('likePost', newPost);
    };
    const handleUnlike = (id) => {
        const action = unlikePost(id);
        dispatch(action);
        const newLikes = [...postDetail.likes];
        const index = newLikes.findIndex((item) => item._id === auth.user._id);

        newLikes.splice(index, 1);
        socket.data.emit('unlikePost', { ...postDetail, likes: newLikes });
        dispatch(updateDetailPost({ ...postDetail, likes: newLikes }));
        dispatch(updatePost({ ...postDetail, likes: newLikes }));
    };
    const handleSave = (id) => {
        const action = savePost(id);
        dispatch(action);

        const user = { ...auth.user };
        user.saved = [...user.saved, { _id: id }];
        dispatch(resetPostUser());

        dispatch(updateAuthUser(user));
        setIsSaved(true);
    };
    const handleUnsave = (id) => {
        const action = unsavePost(id);
        dispatch(action);
        const user = { ...auth.user };
        const index = user.saved.findIndex((item) => item._id === id);
        const saved = [...user.saved];
        saved.splice(index, 1);
        user.saved = saved;
        dispatch(resetPostUser());
        dispatch(updateAuthUser(user));
        setIsSaved(false);
    };

    return (
        <div className="post-detail-bottom">
            <InteractPost
                post={post}
                showIndexImage={false}
                isLiked={isLiked}
                isSaved={isSaved}
                handle={{
                    like: handleLike,
                    unlike: handleUnlike,
                    save: handleSave,
                    unsave: handleUnsave,
                }}
            />
            <div className="createdat-post">
                {timeAgo(post.createdAt, false)}
            </div>
            <CommentInput
                disabled={!isFollowing}
                onComment={handleComment}
                reply={onReply}
            />
        </div>
    );
};

PostDetailBottom.propTypes = {};

export default PostDetailBottom;
