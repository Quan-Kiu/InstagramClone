import React from 'react';
import PropTypes from 'prop-types';
import './suggestions.scss';

const Suggestions = ({ item, recipients, onCheckBoxClick }) => {
    return (
        <div>
            <div className="new-message-modal__suggestions__list ">
                <div className="new-message-modal__suggestions__item d-flex justify-content-between align-items-center">
                    <label
                        className="d-flex align-items-center"
                        htmlFor={item._id}
                    >
                        <img
                            src={item.avatar}
                            className="recipient-avatar"
                            alt={item.username}
                        />
                        <div className="recipient-infos">
                            <div className="recipient-infos__username">
                                {item.username}
                            </div>
                            <div className="recipient-infos__fullname opacity-50">
                                {item.fullname}
                            </div>
                        </div>
                    </label>
                    <input
                        defaultChecked={recipients.some(
                            (recipient) => recipient._id === item._id
                        )}
                        onClick={(e) => onCheckBoxClick(e, item)}
                        id={item._id}
                        type="checkbox"
                        name="recipient"
                    />
                </div>
            </div>
        </div>
    );
};

Suggestions.propTypes = {
    onCheckBoxClick: PropTypes.func.isRequired,
};

export default Suggestions;
