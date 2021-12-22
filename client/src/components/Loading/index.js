import React from 'react';
import './loading.scss';
import PropTypes from 'prop-types';
import { IconInstagram } from '../../assets/icons';

const Loading = (props) => {
    const { bg } = props;
    return (
        <div className="loading" style={{ backgroundColor: bg }}>
            {props.homeLoading ? (
                <IconInstagram />
            ) : (
                <div className="loading__content"></div>
            )}
        </div>
    );
};

Loading.propTypes = {
    bg: PropTypes.string,
    homeLoading: PropTypes.bool,
};
Loading.defaultProps = {
    bg: 'white',
    homeLoading: false,
};

export default Loading;
