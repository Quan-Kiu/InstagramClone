import React from 'react';
import './skeleton-loading.scss';

const SkeletonLoading = (props) => {
    return (
        <div className="skeleton-loading">
            <div className="row">
                <span className="prod-img skeleton-loader"></span>
                <div className="details">
                    <span className="prod-name skeleton-loader"></span>
                    <span className="prod-description skeleton-loader"></span>
                </div>
            </div>
            <div className="row">
                <span className="prod-img skeleton-loader"></span>
                <div className="details">
                    <span className="prod-name skeleton-loader"></span>
                    <span className="prod-description skeleton-loader"></span>
                </div>
            </div>
            <div className="row">
                <span className="prod-img skeleton-loader"></span>
                <div className="details">
                    <span className="prod-name skeleton-loader"></span>
                    <span className="prod-description skeleton-loader"></span>
                </div>
            </div>
            <div className="row">
                <span className="prod-img skeleton-loader"></span>
                <div className="details">
                    <span className="prod-name skeleton-loader"></span>
                    <span className="prod-description skeleton-loader"></span>
                </div>
            </div>
            <div className="row">
                <span className="prod-img skeleton-loader"></span>
                <div className="details">
                    <span className="prod-name skeleton-loader"></span>
                    <span className="prod-description skeleton-loader"></span>
                </div>
            </div>
            <div className="row">
                <span className="prod-img skeleton-loader"></span>
                <div className="details">
                    <span className="prod-name skeleton-loader"></span>
                    <span className="prod-description skeleton-loader"></span>
                </div>
            </div>
        </div>
    );
};

SkeletonLoading.propTypes = {};

export default SkeletonLoading;
