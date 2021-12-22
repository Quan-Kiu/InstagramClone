import React from 'react';
import PropTypes from 'prop-types';
import './alert.scss';

const Alert = (props) => {
    const { onCloseClick, title, message, bg } = props;
    return (
        <div className="alert">
            <div className={`alert__content text-white ${bg}`}>
                <div className="alert__content__close" onClick={onCloseClick}>
                    &times;
                </div>
                <div className="alert__content__title font-weight-bold">
                    {title}
                </div>
                <div className="alert__content__message">{message}</div>
            </div>
        </div>
    );
};

Alert.propTypes = {
    onSubmit: PropTypes.func,
    title: PropTypes.string,
    alert__content_message: PropTypes.string,
};

Alert.defaultProps = {
    onCloseClick: null,
    title: '',
    alert__content_message: '',
};

export default Alert;
