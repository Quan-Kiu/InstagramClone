import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
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
        }, 50);
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
            label: 'X??a',
            isDanger: true,
            path: '/',
            handle: () => {
                dispatch(deleteConversation(action));
                setConversation([]);
                history.push('inbox');
            },
        },
        {
            label: 'H???y',
            path: '/',
            handle: () => setIsInformationModalShow(false),
        },
    ];

    const informationOptionList = [
        {
            label: 'X??a cu???c tr?? chuy???n',
            isDanger: true,
            path: '/',
            handle: () => setIsConfirmModalShow(true),
        },
        {
            label: 'B??o c??o',
            isDanger: true,
            path: '/',
            handle: () => console.log('aa'),
        },
        {
            label: 'H???y',
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
                    title="X??a cu???c tr?? chuy???n?"
                    subTitle="N???u b???n ch???n x??a th?? cu???c tr?? chuy???n n??y s??? b??? x??a kh???i t??i kho???n c???a c??? 2 b???n."
                    onCloseClick={() => setIsConfirmModalShow(false)}
                />
            )}
            {conversation && conversation._id === action ? (
                <div className={`right-content`}>
                    <div className="heading">
                        <div className="avatar-message">
                            <img src={conversation.avatar} alt="" />
                            {conversation.isOnline && (
                                <div className="dot-online bg-success">??</div>
                            )}
                        </div>
                        <span className="username-messenger">
                            <Link to={`/profile?id=${conversation._id}`}>
                                {' '}
                                {conversation.username}
                            </Link>

                            {conversation.isOnline && (
                                <div className="online">??ang ho???t ?????ng</div>
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
                            Tin nh???n c???a b???n
                        </div>
                        <p className="right-content__no-data__sub-title">
                            G???i ???nh v?? tin nh???n ri??ng t?? cho b???n b?? ho???c nh??m.
                        </p>
                        <button
                            className="right-content__no-data__button"
                            onClick={props.onCreateMessageClick}
                        >
                            G???i tin nh???n
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RightContent;
