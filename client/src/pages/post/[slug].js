import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import PostHeading from '../../components/PostHeading';
import Slice from '../../components/Slice';
import { setAlert } from '../../redux/reducer/alertSlice';
import { createNotify } from '../../redux/reducer/notifySlice';
import {
    commnentPost,
    getPostById,
    handleFailed,
    updateDetailPost,
} from '../../redux/reducer/postSlice';
import CommentPostDetail from './CommentPostDetail';
import './post.scss';
import PostDetailBottom from './PostDetailBottom';
import PostDetailCenter from './PostDetailCenter';

const PostDetail = () => {
    const { action } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post);
    const socket = useSelector((state) => state.socket);
    const commentListRef = useRef(<></>);
    const [allReply, setAllReply] = useState([]);
    const [onReply, setOnReply] = useState();
    const search = useLocation().search;
    const cmt = new URLSearchParams(search).get('cmt');
    const elmnt = useRef(<></>);

    useEffect(() => {
        dispatch(getPostById(action));
    }, [action, dispatch]);

    useEffect(() => {
        if (cmt) {
            elmnt.current = document.getElementById(cmt);
            if (elmnt.current) {
                elmnt.current.scrollIntoView(false);
            }
        }
    }, [cmt]);

    useEffect(() => {
        if (post.error) {
            dispatch(setAlert({ type: 'bottomAlert', text: post.error }));
            dispatch(handleFailed());
            history.push('/');
        }
        if (post.postDetail) {
            setAllReply(post.postDetail.comments.filter((item) => item.reply));
        }
    }, [post.postDetail, post.error, dispatch, history]);

    const handleReply = (comment) => {
        setOnReply(comment);
    };

    const handleComment = async (commentText) => {
        try {
            const newComment = {
                postId: post.postDetail._id,
                reply: onReply && onReply._id,
                tag: onReply && onReply.user,
                content: commentText,
            };

            const res = await dispatch(commnentPost(newComment));
            await dispatch(updateDetailPost(res.payload.post));
            if (onReply) {
                const notify = {
                    id: newComment.postId,
                    text: 'đã trả lời bình luận của bạn:',
                    recipients: [onReply.user._id],
                    url: `post/${newComment.postId}?cmt=${onReply._id}`,
                    content: newComment.content,
                    image: res.payload.post.images[0].url,
                };
                await dispatch(createNotify(notify));
                socket.data.emit('replyComment', onReply.user._id);
                const elm = await document.getElementById(onReply._id);
                setTimeout(() => elm.scrollIntoView(false), 10);
                setOnReply();
            } else {
                if (res.payload.post.user._id !== res.payload.comment.user) {
                    const notify = {
                        id: newComment.postId,
                        text: 'đã bình luận bài viết của bạn:',
                        recipients: [res.payload.post.user._id],
                        url: `post/${newComment.postId}?cmt=${res.payload.comment._id}`,
                        content: newComment.content,
                        image: res.payload.post.images[0].url,
                    };

                    await dispatch(createNotify(notify));
                }
                const elm = await document.getElementById(
                    res.payload.comment._id
                );
                setTimeout(() => elm.scrollIntoView(false), 10);
            }
            socket.data.emit('commentPost', res.payload.post);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="post-detail" onClick={() => history.goBack()}>
            <span className="post-detail__close">&times;</span>
            {post.postDetail && post.postDetail._id === action && (
                <div
                    className="post-detail__container"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Row className="post-detail__content">
                        <Col
                            className="post-detail__media"
                            xl={7}
                            lg={7}
                            md={12}
                        >
                            <Slice images={post.postDetail.images} />
                        </Col>
                        <Col
                            xl={5}
                            lg={5}
                            md={12}
                            className="post-detail__infos"
                        >
                            <PostHeading
                                post={post.postDetail}
                                isDetailPage={true}
                            />
                            <div
                                className="comment__post__list"
                                ref={commentListRef}
                            >
                                <PostDetailCenter post={post.postDetail} />
                                {post.postDetail.comments
                                    .filter((item) => !item.reply)
                                    .map((item, index) => (
                                        <CommentPostDetail
                                            handleReply={handleReply}
                                            key={index}
                                            comment={item}
                                            replyList={allReply}
                                        />
                                    ))
                                    .reverse()}
                            </div>
                            <PostDetailBottom
                                post={post.postDetail}
                                handleComment={handleComment}
                                onReply={onReply}
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

PostDetail.propTypes = {};

export default PostDetail;
