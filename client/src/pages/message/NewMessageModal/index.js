import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authApi } from '../../../api/authApi';
import { addConversation } from '../../../redux/reducer/messageSlice';
import SkeletonLoading from '../SkeletonLoading';
import Suggestions from '../Suggestions';
import './new-message-modal.scss';

const NewMessageModal = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const typingTimeoutRef = useRef(null);

    const [recipients, setRecipients] = useState([]);
    const inputTextRef = useRef(<></>);
    const history = useHistory();
    const message = useSelector((state) => state.message);
    const auth = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const handleFilterChange = (e) => {
        setIsLoading(true);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(async () => {
            const search = e.target.value.toLowerCase().replace(/ /g, '');
            if (!search) {
                setSuggestions([]);
            } else {
                try {
                    const { users } = await authApi.getData(
                        `search?username=${search}`
                    );

                    setSuggestions(users);
                } catch (error) {
                    setSuggestions([]);
                }
            }
            setIsLoading(false);
        }, 300);
    };
    const handleRemoveRecipients = (item) => {
        inputTextRef.current.value = '';
        setRecipients(() => {
            const arr = recipients.filter(
                (recipient) => recipient._id !== item._id
            );
            return arr;
        });
        setSuggestions([]);
    };

    const handleCheckBoxClick = (e, item) => {
        inputTextRef.current.value = '';
        setSuggestions([]);
        if (!e.target.checked) {
            setRecipients(() => {
                const arr = recipients.filter(
                    (recipient) => recipient._id !== item._id
                );
                return arr;
            });
        } else {
            setRecipients(() => {
                const arr = [...recipients];
                arr.push(item);
                return arr;
            });
            setTimeout(() => inputTextRef.current.scrollIntoView(false), 10);
        }
    };

    const handleNewConversation = () => {
        if (recipients.length > 0) {
            const isExist = message.conversations.data.findIndex(
                (item) => item._id === recipients[0]._id
            );
            if (isExist >= 0) {
                props.onClose();
                return history.push(`${recipients[0]._id}`);
            }
            const newConversation = {
                avatar: recipients[0].avatar,
                username: recipients[0].username,
                fullname: recipients[0].fullname,
                _id: recipients[0]._id,
                text: '',
                sender: auth.user,
                media: [],
            };

            dispatch(addConversation(newConversation));

            props.onClose();
            return history.push(`${recipients[0]._id}`);
        }
    };
    return (
        <div
            className="new-message-modal slice-in-bck-center"
            onClick={props.onClose}
        >
            <div
                className="new-message-modal__content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="new-message-modal__heading d-flex justify-content-between align-items-center">
                    <div
                        className="new-message-modal__close"
                        onClick={props.onClose}
                    >
                        &times;
                    </div>
                    <div className="new-message-modal__title">Tin nhắn mới</div>
                    <div
                        className="new-message-modal__continue"
                        onClick={handleNewConversation}
                    >
                        Tiếp
                    </div>
                </div>
                <div className="new-message-modal__input d-flex">
                    <div className="new-message-modal__input__to">Tới:</div>
                    <div className="new-message-modal__input__text">
                        <div className="new-message-modal__input__recipients d-flex">
                            {recipients.length > 0 &&
                                recipients.map((item, index) => (
                                    <div
                                        key={index}
                                        className="new-message-modal__input__recipient"
                                    >
                                        {item.username}
                                        <span
                                            onClick={() =>
                                                handleRemoveRecipients(item)
                                            }
                                        >
                                            &times;
                                        </span>
                                    </div>
                                ))}
                        </div>
                        <input
                            ref={inputTextRef}
                            onChange={handleFilterChange}
                            type="text"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>
                <div className="new-message-modal__suggestions ">
                    {isLoading ? (
                        <SkeletonLoading />
                    ) : suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                            <Suggestions
                                key={index}
                                item={item}
                                onCheckBoxClick={handleCheckBoxClick}
                                recipients={recipients}
                            />
                        ))
                    ) : inputTextRef.current.value ? (
                        <div className="not-suggestion">
                            Không tìm thấy tài khoản
                        </div>
                    ) : (
                        <>
                            <div className="new-message-modal__suggestions__title">
                                Gợi ý
                            </div>
                            {message.conversations.total > 0 ? (
                                message.conversations.data.map(
                                    (item, index) => (
                                        <Suggestions
                                            key={index}
                                            item={item}
                                            onCheckBoxClick={
                                                handleCheckBoxClick
                                            }
                                            recipients={recipients}
                                        />
                                    )
                                )
                            ) : (
                                <div className="not-suggestion">
                                    Không tìm thấy tài khoản
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

NewMessageModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default NewMessageModal;
