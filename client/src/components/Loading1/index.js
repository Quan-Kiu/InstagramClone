import React from 'react';
import './loading1.scss';
import PropTypes from 'prop-types';

const Loading1 = (props) => {
    return (
        <div
            className="lds-spinner"
            style={{ width: `${props.width}`, height: `${props.height}` }}
        >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

Loading1.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
};

Loading1.defaultProps = {
    width: '50px',
    height: '50px',
};

export default Loading1;
