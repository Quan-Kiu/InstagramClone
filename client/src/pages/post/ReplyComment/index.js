import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './replycomment.scss';

import ReplyCommentItem from '../../../components/ReplyCommentItem';
import { useLocation } from 'react-router';

const ReplyComment = (props) => {
    const search = useLocation().search;

    const [isShowReply, setIsShowReply] = useState(() => {
        const cmt = new URLSearchParams(search).get('cmt');
        if (cmt === props.comment._id) {
            return true;
        }
        return false;
    });

    const reply = props.data.filter((item) => item.reply === props.comment._id);
    return (
        <>
            {reply.length > 0 && (
                <div className="reply">
                    <div
                        className="reply-show"
                        onClick={() => setIsShowReply(!isShowReply)}
                    >
                        <div className="divider"></div>
                        {isShowReply
                            ? `Ẩn câu trả lời`
                            : `Xem câu trả lời (${reply.length}).`}
                    </div>
                    {isShowReply && (
                        <div className="reply__list">
                            {reply
                                .filter(
                                    (item) => item.reply === props.comment._id
                                )
                                .map((item, index) => (
                                    <ReplyCommentItem
                                        key={index}
                                        reply={item}
                                        handle={props.handle}
                                        handleReply={props.handleReply}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

ReplyComment.propTypes = {
    data: PropTypes.array,
    comment: PropTypes.object,
};

ReplyComment.defaultProps = {
    data: [],
    comment: {},
};

export default ReplyComment;
