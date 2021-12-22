import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getNotifies, isReadNotify } from '../../redux/reducer/notifySlice';
import { timeAgo } from '../../utils/formatTime';
import Loading1 from '../Loading1';
import './notify.scss';

const Notify = (props) => {
    const notify = useSelector((state) => state.notify);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!notify.isReadAll) {
            dispatch(getNotifies());
        }
    }, [dispatch, notify.isReadAll]);

    return (
        <div className="notify">
            <input type="text" autoFocus={true} onBlur={props.onClose} />
            <div
                className="notify__content"
                onMouseDown={(e) => e.preventDefault()}
            >
                {notify.loading ? (
                    <div className="notify-loading">
                        <Loading1 />
                    </div>
                ) : (
                    <>
                        <div className="heading">
                            <div className="title">Thông báo</div>
                            <div
                                className="clear-notify"
                                onClick={() => {
                                    notify.unRead.forEach((element) => {
                                        dispatch(isReadNotify(element._id));
                                    });
                                }}
                            >
                                Đánh dấu đã đọc
                            </div>
                        </div>
                        <div className="notify__list">
                            {notify.notifies.length > 0 ? (
                                notify.notifies.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`notify__item ${
                                            !item.isRead ? 'active' : ''
                                        }`}
                                        onClick={() => {
                                            if (!item.isRead) {
                                                dispatch(
                                                    isReadNotify(item._id)
                                                );
                                            }
                                            history.push(`/${item.url}`);
                                            props.onClose();
                                        }}
                                    >
                                        <img
                                            className="avatar-user"
                                            src={item.user.avatar}
                                            alt={item.user.username}
                                        />
                                        <div className="content">
                                            <span className="name-user">
                                                {item.user.username}
                                            </span>
                                            {item.text}
                                            <span className="notify-content">
                                                {item.content.length > 25
                                                    ? `${item.content.slice(
                                                          0,
                                                          25
                                                      )}...`
                                                    : item.content}
                                            </span>
                                            <span className="createdat">
                                                {timeAgo(item.createdAt)}
                                            </span>
                                        </div>
                                        {item.image &&
                                            (item.image.match(/video/i) ? (
                                                <video className="image-post">
                                                    <source
                                                        src={item.image}
                                                        type="video/mp4"
                                                    />
                                                </video>
                                            ) : (
                                                <img
                                                    src={item.image}
                                                    alt={item.content}
                                                    className="image-post"
                                                />
                                            ))}
                                    </div>
                                ))
                            ) : (
                                <div className="not-notify">
                                    Không có thông báo mới.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

Notify.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default Notify;
