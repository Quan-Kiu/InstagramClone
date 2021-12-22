import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Icons from '../Icons';
import './commentinput.scss';

const CommentInput = (props) => {
    const commentRef = useRef(<></>);
    const [commentText, setCommentText] = useState('');
    const handleSetContent = (content) => {
        if (!props.disabled) {
            setCommentText(content);
        }
    };
    useEffect(() => {
        if (props.reply) {
            setCommentText(`@${props.reply.user.username} `);

            commentRef.current.focus();
        }
    }, [props.reply]);
    useEffect(() => {
        if (props.disabled) {
            commentRef.current.placeholder = `Theo dõi người dùng để bình luận.`;
            commentRef.current.disabled = true;
        } else {
            commentRef.current.disabled = false;
            commentRef.current.placeholder = 'Thêm bình luận...';
        }
    }, [props.disabled]);

    return (
        <>
            <div className="dropdown-divider"></div>
            <div className="comment-input">
                <Icons content={commentText} setContent={handleSetContent} />
                <input
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            if (commentText) {
                                setCommentText('');
                                props.onComment(commentText);
                            }
                        }
                    }}
                    ref={commentRef}
                    className="comment-input-field"
                    value={commentText}
                    onChange={(e) =>
                        setCommentText(e.target.value.replace(/^\s+/, ''))
                    }
                    maxLength={250}
                    placeholder="Thêm bình luận..."
                    type="text"
                />
                <Button
                    disabled={!commentText}
                    className="btn-comment"
                    handle={() => {
                        if (!props.disabled) {
                            setCommentText('');
                            props.onComment(commentText);
                        }
                    }}
                >
                    Đăng
                </Button>
            </div>
        </>
    );
};

CommentInput.propTypes = {
    onComment: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

CommentInput.defaultProps = {
    disabled: false,
};

export default CommentInput;
