import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AudioCallIcon, MoreIcon, UnlikeIcon } from '../../../assets/icons';
import Settings from '../../../components/Settings';
import { setAlert } from '../../../redux/reducer/alertSlice';
import { deleteMessage } from '../../../redux/reducer/messageSlice';
import { dateTime, formatTime } from '../../../utils/formatTime';
import './message-item.scss';

const MessageItem = ({ mess, friend, isShowTime }) => {
    const [isMoreHandleMessage, setIsMoreHandleMessage] = useState(false);
    const [confirmDeleteMessageShow, setConfirmDeleteMessageShow] =
        useState(false);
    const socket = useSelector((state) => state.socket);
    const auth = useSelector((state) => state.auth);
    const hoverRef = useRef(<></>);
    const dispatch = useDispatch();
    const confirmList = [
        {
            label: 'Thu hồi',
            isDanger: true,
            path: 'delete',
            handle: () => {
                dispatch(deleteMessage({ id: mess._id, socket: socket.data }));
            },
        },
        {
            label: 'Hủy',
            path: '/',
            handle: () => setConfirmDeleteMessageShow(false),
        },
    ];
    const handleMessageList = [
        friend
            ? {
                  label: 'Báo cáo',
                  handle: () => console.log('Báo cáo'),
              }
            : {
                  label: 'Thu hồi',
                  handle: () => setConfirmDeleteMessageShow(true),
              },
        mess.text && {
            label: 'Sao chép',
            handle: () => {
                navigator.clipboard.writeText(mess.text);
                dispatch(
                    setAlert({
                        type: 'bottomAlert',
                        text: 'Sao chép thành công.',
                    })
                );
            },
        },
    ];
    return (
        <>
            {confirmDeleteMessageShow && (
                <Settings
                    title="Thu hồi tin nhắn?"
                    subTitle="Tính năng thu hồi sẽ xóa tin nhắn đối với mọi người, nhưng họ có thể đã xem tin nhắn đó."
                    data={confirmList}
                    onCloseClick={() => setConfirmDeleteMessageShow(false)}
                />
            )}

            <div className={`message__item ${friend ? 'friend' : ''}`}>
                {(Date.parse(mess.createdAt) - Date.parse(isShowTime) >=
                    3600000 ||
                    !isShowTime) && (
                    <div className="message__createdAt">
                        {dateTime(mess.createdAt)}
                    </div>
                )}
                <div
                    ref={hoverRef}
                    className={`hover ${
                        friend ? 'friend-message' : 'your-message'
                    }`}
                >
                    {friend && (
                        <img
                            className="friend-message-avatar"
                            src={mess.sender.avatar}
                            alt=""
                        />
                    )}
                    {mess.media.length > 0 && (
                        <div className="message-media-content">
                            {mess.media[0].url.match(/video/i) ? (
                                <video controls>
                                    <source
                                        src={mess.media[0].url}
                                        type="video/mp4"
                                    />
                                </video>
                            ) : (
                                <img
                                    src={mess.media[0].url}
                                    alt={mess.media[0].public_id}
                                />
                            )}
                        </div>
                    )}{' '}
                    {mess.icon && <UnlikeIcon className="send-like-icon" />}
                    {mess.call &&
                        (mess.call.answer ? (
                            <div className="message-text-content call">
                                <div className="icon-call">
                                    <AudioCallIcon />
                                </div>
                                <div className="call-content">
                                    Đã kết thúc cuộc gọi.
                                    <div className="time-call">
                                        {formatTime(
                                            Math.floor(mess.call.times / 60000)
                                        ) +
                                            ':' +
                                            formatTime(
                                                (mess.call.times / 1000) % 60
                                            )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="message-text-content call">
                                <div className="icon-call active">
                                    <AudioCallIcon />
                                </div>
                                <div className="call-content">
                                    {mess.sender._id !== auth.user._id
                                        ? 'Bạn đã nhỡ 1 cuộc gọi.'
                                        : 'Kết thúc cuộc gọi'}
                                    <div className="time-call">
                                        {dateTime(mess.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}{' '}
                    {mess.text && (
                        <div className="message-text-content">{mess.text}</div>
                    )}
                    <MoreIcon
                        className="more-icon"
                        onClick={(e) => {
                            hoverRef.current.classList.remove('hover');
                            e.target.style.display = 'block';
                            setIsMoreHandleMessage(!isMoreHandleMessage);
                        }}
                    />
                    {isMoreHandleMessage && (
                        <div className="more-handle-message__modal scale-in-center">
                            <div
                                onBlur={() => {
                                    hoverRef.current.classList.add('hover');

                                    setIsMoreHandleMessage(false);
                                }}
                                className="more-handle-message__modal-func"
                            >
                                {handleMessageList.map((item, index) => (
                                    <div
                                        key={index}
                                        className="handle-message__item"
                                        onMouseDown={() => {
                                            item.handle();
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                ))}

                                <input
                                    id={mess._id}
                                    autoFocus={true}
                                    type="text"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

MessageItem.propTypes = {
    mess: PropTypes.object.isRequired,
    friend: PropTypes.bool,
};

MessageItem.defaultProps = {
    friend: false,
};

export default MessageItem;
