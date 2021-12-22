import React from 'react';
import PropTypes from 'prop-types';
import {
    CommentIcon,
    DirectIcon,
    LikeIcon,
    SaveIcon,
    UnlikeIcon,
    UnsaveIcon,
} from '../../assets/icons';

import './interactpost.scss';
import { useHistory } from 'react-router';
const InteractPost = (props) => {
    const history = useHistory();
    return (
        <>
            <div className="interact d-flex justify-content-between align-items-center">
                <div className="left">
                    {props.isLiked ? (
                        <UnlikeIcon
                            onClick={() => props.handle.unlike(props.post._id)}
                        />
                    ) : (
                        <LikeIcon
                            onClick={() => props.handle.like(props.post._id)}
                        />
                    )}
                    <CommentIcon
                        onClick={() => {
                            if (history.location.pathname === '/') {
                                history.push(`/post/${props.post._id}`);
                            } else {
                                const inputElement =
                                    document.getElementsByClassName(
                                        'comment-input-field'
                                    )[0];
                                inputElement.focus();
                            }
                        }}
                    />
                    <DirectIcon />
                </div>
                {props.showIndexImage && (
                    <div className="center">
                        {props.post.images.length > 1 &&
                            props.post.images.map((image, index) => (
                                <span
                                    key={index}
                                    className={
                                        index === props.indexImage
                                            ? 'bg-primary'
                                            : ''
                                    }
                                ></span>
                            ))}
                    </div>
                )}
                <div className="right">
                    {props.isSaved ? (
                        <UnsaveIcon
                            onClick={() => props.handle.unsave(props.post._id)}
                        />
                    ) : (
                        <SaveIcon
                            onClick={() => props.handle.save(props.post._id)}
                        />
                    )}
                </div>
            </div>
            {props.post.likes.length > 0 ? (
                <div className="counter-like-post">
                    <span>{props.post.likes.length} lươt thích</span>
                </div>
            ) : (
                <div className="counter-like-post">
                    <span>Hãy là người đầu tiên thích bài viết này.</span>
                </div>
            )}
        </>
    );
};

InteractPost.propTypes = {
    post: PropTypes.object,
    indexImage: PropTypes.number,
    showIndexImage: PropTypes.bool,
    handle: PropTypes.object,
    isLiked: PropTypes.bool,
    isSaved: PropTypes.bool,
};

InteractPost.defaultProps = {
    post: {},
    indexImage: 0,
    showIndexImage: false,
    isLiked: false,
    isSaved: false,
    handle: {},
};

export default InteractPost;
