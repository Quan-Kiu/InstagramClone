import React from 'react';
import './message-left-content.scss';
import { CreateMessageIcon } from '../../../assets/icons';
import { useSelector } from 'react-redux';
import { timeAgo } from '../../../utils/formatTime';
import { useHistory, useParams } from 'react-router-dom';

const LeftContent = (props) => {
    const message = useSelector((state) => state.message);
    const auth = useSelector((state) => state.auth);
    const history = useHistory();
    const { action } = useParams();

    return (
        <>
            <div className="left-content">
                <div className="heading">
                    <span>{auth.user.username}</span>
                    <CreateMessageIcon onClick={props.onCreateMessageClick} />
                </div>
                <div className="message-list">
                    {message.conversations.total > 0 &&
                        message.conversations.data.map((item, index) => (
                            <div
                                key={index}
                                className={`message-item ${
                                    action === item._id ? 'active' : ''
                                }`}
                                onClick={() => history.push(`${item._id}`)}
                            >
                                <div className="avatar-user">
                                    <img
                                        src={item.avatar}
                                        alt={item.username}
                                    ></img>
                                    {item.isOnline && (
                                        <div className="dot-online bg-success">
                                            ·
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={`message-content ${
                                        !item.isRead
                                            ? item.sender._id === auth.user._id
                                                ? ''
                                                : 'fw-bold'
                                            : ''
                                    }`}
                                >
                                    <div className="username-user">
                                        {item.username}
                                    </div>
                                    <div className="content">
                                        {item.updatedAt && (
                                            <>
                                                {item.sender._id ===
                                                    auth.user._id && 'Bạn: '}

                                                {(item.text &&
                                                    item.text.length > 12) ||
                                                item.text.includes('\n')
                                                    ? item.text.slice(
                                                          0,
                                                          item.text.includes(
                                                              '\n'
                                                          )
                                                              ? item.text.indexOf(
                                                                    '\n'
                                                                )
                                                              : 12
                                                      ) + '...'
                                                    : item.text}

                                                {item.icon && '❤️'}

                                                {item.call && 'Cuộc gọi mới'}

                                                {item.media.length > 0 &&
                                                    'đã gửi 1 tin nhắn.'}

                                                <span>·</span>

                                                <div className="message-time">
                                                    {timeAgo(item.updatedAt)}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {!item.isRead &&
                                    item.sender._id !== auth.user._id && (
                                        <div className="isRead"></div>
                                    )}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default LeftContent;
