import PropTypes from 'prop-types';
import React from 'react';
import FollowItem from '../FollowItem';
import './followlist_modal.scss';

const FollowList = (props) => {
    return (
        <div
            className="follow-list d-flex justify-content-center align-items-center "
            onClick={props.onCloseClick}
        >
            <div className="follow-list__content slice-in-bck-center  bg-white">
                <div className="title text-center">{props.title}</div>
                <div
                    className="follow-list__close"
                    onClick={props.onCloseClick}
                >
                    &times;
                </div>
                <div className="follow-list__content__list">
                    {props.data &&
                        props.data.map((item, index) => {
                            return <FollowItem key={index} follower={item} />;
                        })}
                </div>
            </div>
        </div>
    );
};

FollowList.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired,
};

export default FollowList;
