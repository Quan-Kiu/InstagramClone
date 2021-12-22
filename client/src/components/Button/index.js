import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';
import { Link } from 'react-router-dom';

const Button = (props) => {
    return props.path ? (
        <Link className={`btn ${props.className}`} to={props.path}>
            {props.children}
        </Link>
    ) : (
        <button
            disabled={props.disabled}
            className={`btn ${props.className}`}
            onClickCapture={(e) => {
                e.stopPropagation();
                props.handle();
            }}
        >
            {props.children}
        </button>
    );
};

Button.propTypes = {
    className: PropTypes.string,
    path: PropTypes.string,
    handle: PropTypes.func,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    className: '',
    path: '',
    handle: null,
    disabled: false,
};

export default Button;
