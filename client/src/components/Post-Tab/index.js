import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './post-tab.scss';
import { SaveIcon, UserOutlineIcon, GridIcon } from '../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPostsByUser,
    getPostsSavedByUser,
} from '../../redux/reducer/postSlice';
import MyPost from '../MyPost';
import Loading1 from '../Loading1';

const tabs = [
    {
        type: 'default',
        title: 'Bài viết',
        icon: <GridIcon />,
    },

    {
        type: 'saved',
        title: 'Đã lưu',
        icon: <SaveIcon />,
    },

    {
        type: 'tagged',
        title: 'Được gắn thẻ',
        icon: <UserOutlineIcon />,
    },
];

const PostTab = (props) => {
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post);
    useEffect(() => {
        if (props.tabActive === 'default') {
            if (
                !post.postUser.default.get ||
                post.postUser.default.user !== props.user._id
            ) {
                dispatch(getPostsByUser(props.user._id));
            }
        }
    }, [
        props.tabActive,
        post.postUser.default.get,
        post.postUser.default.user,
        props.user._id,
        dispatch,
    ]);

    useEffect(() => {
        if (props.tabActive === 'saved') {
            if (
                !post.postUser.saved.get ||
                post.postUser.saved.user !== props.user._id
            ) {
                dispatch(getPostsSavedByUser(props.user._id));
            }
        }
    }, [
        props.tabActive,
        post.postUser.saved.get,
        post.postUser.saved.user,
        props.user._id,
        dispatch,
    ]);

    return (
        <div className="post-tab">
            <div className="post-tab__name">
                {tabs.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => props.onTabClick(item.type)}
                        className={`name ${
                            item.type === props.tabActive ? 'active' : ''
                        }`}
                    >
                        {item.icon}
                        {item.title}
                    </div>
                ))}
            </div>
            <div className="post-tab__content text-center">
                {!post.loading ? (
                    <div className="my-post__list">
                        {post.postUser[props.tabActive].data.map(
                            (item, index) => (
                                <MyPost key={index} post={item} />
                            )
                        )}
                    </div>
                ) : (
                    <Loading1 />
                )}
            </div>
        </div>
    );
};

PostTab.propTypes = {
    tabActive: PropTypes.string,
    onTabClick: PropTypes.func,
    user: PropTypes.object,
};

PostTab.defaultProps = {
    tabActive: '',
    onTabClick: null,
    user: {},
};

export default PostTab;
