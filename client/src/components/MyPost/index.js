import React, { useRef } from 'react';
import { useHistory } from 'react-router';
import { CommentIcon, IconMultiple } from '../../assets/icons';
import './mypost.scss';

const MyPost = ({ post }) => {
    const videoRef = useRef(<video></video>);
    const history = useHistory();

    return (
        <div
            className="my-post__item"
            onClick={() => history.push(`/post/${post._id}`)}
        >
            {post.images[0].url.match(/video/i) ? (
                <video ref={videoRef}>
                    <source src={post.images[0].url} type="video/mp4" />
                </video>
            ) : (
                <img src={post.images[0].url} alt={post.images[0].url} />
            )}
            <div className="counter">
                <div className="counter-item likes">
                    <span className="heart"></span>
                    {post.likes.length}
                </div>
                <div className="counter-item comments">
                    <CommentIcon />
                    {post.comments.length}
                </div>
            </div>
            {post.images.length > 1 && (
                <IconMultiple className="multiple-icon" />
            )}
        </div>
    );
};

export default MyPost;
