import React from 'react';
import { useSelector } from 'react-redux';
import './topalert.scss';

const TopAlert = (props) => {
    const alert = useSelector((state) => state.alert);

    return (
        alert.newPostAlert && (
            <div className="top-alert">
                <div
                    className="top-alert__content"
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    <div className="text">{alert.newPostAlert}</div>
                </div>
            </div>
        )
    );
};

export default TopAlert;
