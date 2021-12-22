import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ImageIcon, LikeIcon } from '../../assets/icons';
import Icons from '../../components/Icons';
import { setAlert } from '../../redux/reducer/alertSlice';

import {
    createMessage,
    updateConversation,
} from '../../redux/reducer/messageSlice';
import { checkImage, uploadImage } from '../../utils/handleImageUpload';
import './messageinput.scss';

const MessageInput = ({ conversation }) => {
    const [messageText, setMessageText] = useState('');
    const inputFileRef = useRef(<></>);
    const auth = useSelector((state) => state.auth);
    const socket = useSelector((state) => state.socket);
    const { action } = useParams();
    const dispatch = useDispatch();
    const handleSetContent = (content) => {
        setMessageText(content);
    };

    const handleSendMessage = async (message) => {
        try {
            await dispatch(createMessage({ message, socket: socket.data }));

            dispatch(updateConversation(message));
        } catch (error) {}
    };

    const handleSendMedia = async (e) => {
        const mediaList = e.target['files'];
        const error = checkImage(mediaList[0]);
        if (error) {
            dispatch(setAlert({ type: 'bottomAlert', text: error }));

            return;
        }
        try {
            const mediaArrayUrl = await uploadImage(mediaList);
            if (mediaArrayUrl) {
                const message = {
                    sender: { _id: auth.user._id },
                    recipient: action,
                    text: '',
                    media: mediaArrayUrl,
                    icon: false,
                    call: null,

                    isRead: false,
                    createdAt: new Date().toISOString(),
                };
                handleSendMessage(message);
            }
        } catch (error) {
            dispatch(setAlert({ type: 'bottomAlert', text: error.message }));
        }
    };

    const handleSendText = () => {
        if (!messageText) return;
        setMessageText('');
        const message = {
            sender: { _id: auth.user._id },
            recipient: action,
            text: messageText,
            icon: false,
            isRead: false,
            call: null,
            media: [],
            createdAt: new Date().toISOString(),
        };
        handleSendMessage(message);
    };

    const handleSendLike = async () => {
        if (messageText) return;
        const message = {
            sender: { _id: auth.user._id },
            recipient: action,
            text: messageText,
            media: [],
            isRead: false,
            call: null,

            icon: true,
            createdAt: new Date().toISOString(),
        };
        handleSendMessage(message);
    };
    return (
        <div className="message-input">
            <Icons content={messageText} setContent={handleSetContent} />
            <input
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendText();
                    }
                }}
                value={messageText}
                type="text"
                placeholder="Nhắn tin..."
                maxLength={250}
                onChange={(e) =>
                    setMessageText(e.target.value.replace(/^\s+/, ''))
                }
            />
            {messageText ? (
                <button onClick={handleSendText} className="send-button">
                    Gửi
                </button>
            ) : (
                <>
                    <input
                        onChange={handleSendMedia}
                        ref={inputFileRef}
                        type="file"
                    />
                    <ImageIcon onClick={() => inputFileRef.current.click()} />
                    <LikeIcon onClick={handleSendLike} />
                </>
            )}
        </div>
    );
};

MessageInput.propTypes = {};

export default MessageInput;
