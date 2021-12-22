import React from 'react';
import PropTypes from 'prop-types';
import './settings.scss';
import { Link } from 'react-router-dom';

const Settings = (props) => {
    return (
        <div className="settings" onClick={props.onCloseClick}>
            <div
                className={`settings__content slice-in-bck-center  ${props.className}`}
            >
                {props.title && (
                    <>
                        <div className="settings__title">
                            {props.title}
                            <div
                                className="fw-normal mt-2 mx-4 opacity-75"
                                style={{ fontSize: '1.3rem' }}
                            >
                                {props.subTitle && props.subTitle}
                            </div>
                        </div>
                    </>
                )}
                {props.data.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        onClick={(e) => {
                            if (item.handle) {
                                e.preventDefault();
                                item.handle();
                            }
                        }}
                    >
                        {item.isDanger ? (
                            <div className="text-danger fw-bold">
                                {item.label}
                            </div>
                        ) : (
                            item.label
                        )}
                    </Link>
                ))}
                {props.children}
            </div>
        </div>
    );
};

Settings.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    onCloseClick: PropTypes.func,
};

Settings.defaultProps = {
    className: '',
    data: [],
    title: '',
    subTitle: '',
    onCloseClick: null,
};

export default Settings;
