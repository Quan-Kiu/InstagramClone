import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
    DirectIcon,
    MoreIcon,
    AudioCallIcon,
    VideoCallIcon,
} from '../../../assets/icons';
import MessageInput from '../../../components/MessageInput';
import Settings from '../../../components/Settings';
import { setCall } from '../../../redux/reducer/callSlice';
import {
    deleteConversation,
    getMessages,
    updateIsRead,
} from '../../../redux/reducer/messageSlice';
import MessageItem from '../MessageItem';
import './message-right-content.scss';

const RightContent = (props) => {
    const { action } = useParams();
    const history = useHistory();
    const message = useSelector((state) => state.message);
    const call = useSelector((state) => state.call);
    const peer = useSelector((state) => state.peer);
    const socket = useSelector((state) => state.socket);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [messageList, setMessageList] = useState([]);
    const messageListRef = useRef();
    const [conversation, setConversation] = useState();
    const [isInformationModalShow, setIsInformationModalShow] = useState(false);
    const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);

    useEffect(() => {
        if (action !== 'inbox') {
            const indexConversation = message.conversations.data.findIndex(
                (item) => item._id === action
            );
            if (indexConversation < 0) {
                return history.push('inbox');
            }
            if (
                !message.conversations.data[indexConversation].isRead &&
                message.conversations.data[indexConversation].sender._id !==
                    auth.user._id
            ) {
                dispatch(updateIsRead(action));
            }

            setConversation(message.conversations.data[indexConversation]);

            const indexMessages = message.data.findIndex(
                (item) => item._id === action
            );
            if (indexMessages < 0) {
                dispatch(
                    getMessages({
                        page: message.page,
                        id: action,
                    })
                );
            } else {
                setMessageList(message.data[indexMessages]);
            }
        }
    }, [
        dispatch,
        history,
        action,
        message.data,
        message.conversations.data,
        auth.user._id,
        message.page,
    ]);

    useEffect(() => {
        const autoScroll = setTimeout(() => {
            if (messageListRef.current) {
                messageListRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
        }, 200);
        return () => clearTimeout(autoScroll);
    }, [action, message.conversations.data]);

    const handleScrollToTop = (e) => {
        if (e.target.scrollTop === 0) {
            if (messageList.error) {
                e.target.removeEventListener('scroll', handleScrollToTop, true);
            } else if (!message.loading) {
                dispatch(
                    getMessages({
                        page: messageList.page + 1,
                        id: action,
                    })
                );
            }
        }
    };

    const confirmDeleteConversation = [
        {
            label: 'Xóa',
            isDanger: true,
            path: '/',
            handle: () => {
                dispatch(deleteConversation(action));
                setConversation([]);
                history.push('inbox');
            },
        },
        {
            label: 'Hủy',
            path: '/',
            handle: () => setIsInformationModalShow(false),
        },
    ];

    const informationOptionList = [
        {
            label: 'Xóa cuộc trò chuyện',
            isDanger: true,
            path: '/',
            handle: () => setIsConfirmModalShow(true),
        },
        {
            label: 'Báo cáo',
            isDanger: true,
            path: '/',
            handle: () => console.log('aa'),
        },
        {
            label: 'Hủy',
            path: '/',
            handle: () => setIsInformationModalShow(false),
        },
    ];

    const handleCall = ({ video }) => {
        if (!call.data) {
            const { username, avatar, fullname } = conversation;
            const message = {
                sender: auth.user._id,
                recipient: action,
                username,
                avatar,
                fullname,
                video,
            };
            dispatch(setCall(message));

            const messageToClient = {
                sender: auth.user._id,
                recipient: action,
                avatar: auth.user.avatar,
                username: auth.user.username,
                fullname: auth.user.fullname,
                video,
            };

            if (peer.data.open) messageToClient.peerId = peer.data._id;
            socket.data.emit('callUser', {
                messageToClient,
                myCallMessage: message,
            });
        }
    };

    const handleVideoCall = () => {
        handleCall({ video: true });
    };

    const handleAudioCall = () => {
        handleCall({ video: false });
    };

    return (
        <>
            {isInformationModalShow && (
                <Settings
                    data={informationOptionList}
                    onCloseClick={() => setIsInformationModalShow(false)}
                />
            )}
            {isConfirmModalShow && (
                <Settings
                    data={confirmDeleteConversation}
                    title="Xóa cuộc trò chuyện?"
                    subTitle="Nếu bạn chọn xóa thì cuộc trò chuyện này sẽ bị xóa khỏi tài khoản của cả 2 bạn."
                    onCloseClick={() => setIsConfirmModalShow(false)}
                />
            )}
            {conversation ? (
                <div className="right-content">
                    <div className="heading">
                        <div className="avatar-message">
                            <img src={conversation.avatar} alt="" />
                            {conversation.isOnline && (
                                <div className="dot-online bg-success">·</div>
                            )}
                        </div>
                        <span className="username-messenger">
                            {conversation.username}
                            {conversation.isOnline && (
                                <div className="online">đang hoạt động</div>
                            )}
                        </span>
                        <VideoCallIcon onClick={handleVideoCall} />
                        <AudioCallIcon onClick={handleAudioCall} />

                        <MoreIcon
                            onClick={() => setIsInformationModalShow(true)}
                        />
                    </div>
                    <div className="center" onScroll={handleScrollToTop}>
                        <div
                            ref={messageListRef}
                            id="messageList"
                            className="message__list"
                        >
                            {messageList.total > 0 &&
                                messageList.messages
                                    .slice(0)
                                    .reverse()
                                    .map((mess, index) =>
                                        mess.sender._id === auth.user._id ? (
                                            <MessageItem
                                                isShowTime={
                                                    index - 1 >= 0 &&
                                                    messageList.messages[
                                                        messageList.messages
                                                            .length - index
                                                    ].createdAt
                                                }
                                                key={index}
                                                mess={mess}
                                            />
                                        ) : (
                                            <MessageItem
                                                isShowTime={
                                                    index - 1 >= 0 &&
                                                    messageList.messages[
                                                        messageList.messages
                                                            .length -
                                                            index -
                                                            1
                                                    ].createdAt
                                                }
                                                key={index}
                                                mess={mess}
                                                friend={true}
                                            />
                                        )
                                    )}
                        </div>
                    </div>
                    <div className="bottom">
                        <MessageInput
                            messageListRef={messageListRef}
                            conversation={conversation}
                        />
                    </div>
                </div>
            ) : (
                <div className="right-content">
                    <div className="right-content__no-data">
                        <div className="right-content__no-data__icon">
                            <DirectIcon />
                        </div>
                        <div className="right-content__no-data__title">
                            Tin nhắn của bạn
                        </div>
                        <p className="right-content__no-data__sub-title">
                            Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm.
                        </p>
                        <button
                            className="right-content__no-data__button"
                            onClick={props.onCreateMessageClick}
                        >
                            Gửi tin nhắn
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RightContent;
