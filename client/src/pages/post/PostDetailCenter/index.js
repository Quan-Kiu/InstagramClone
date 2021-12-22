import React from 'react';
import { timeAgo } from '../../../utils/formatTime';
import './postdetailcenter.scss';

const PostDetailCenter = ({ post }) => {
    return (
        <div className="post-detail__center">
            {post.content && (
                <div className="post-detail__content">
                    <div className="content-post">
                        <img src={post.user.avatar} alt={post.user.username} />
                        <div className="content">
                            <div className="top">
                                <span>{post.user.username}</span>
                                {post.content}
                            </div>
                            <div className="createdat">
                                {timeAgo(post.createdAt)}
                            </div>
                        </div>
                    </div>
                    .
                </div>
            )}
        </div>
    );
};

PostDetailCenter.propTypes = {};

export default PostDetailCenter;
