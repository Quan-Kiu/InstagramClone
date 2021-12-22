import React, { useEffect, useState } from 'react';
import {
    SettingIcon,
    MoreIcon,
    IconDone,
    IconAccount,
} from '../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'reactstrap';
import Button from '../../components/Button';
import FollowListModal from '../../components/FollowList_Modal';
import Loading from '../../components/Loading';
import PostTab from '../../components/Post-Tab';
import Settings from '../../components/Settings';
import { logout } from '../../redux/reducer/authSlice';
import { follow, unFollow } from '../../redux/reducer/userSlice';
import '../../scss/pages/profile.scss';
import Footer from '../../components/Footer';
import { addConversation } from '../../redux/reducer/messageSlice';
import { getProfile, setProfile } from '../../redux/reducer/profileSlice';

const Profile = () => {
    const auth = useSelector((state) => state.auth);
    const message = useSelector((state) => state.message);
    const profile = useSelector((state) => state.profile);
    const post = useSelector((state) => state.post);
    const socket = useSelector((state) => state.socket);
    const dispatch = useDispatch();
    const [isSettingShow, setIsSettingShow] = useState(false);
    const [isMoreModalShow, setIsMoreModalShow] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [postTabActive, setPostTabActive] = useState('default');
    const { search } = useLocation();
    const [followListShow, setFollowListShow] = useState({
        isShow: false,
        data: [],
        title: '',
    });
    const id = new URLSearchParams(search).get('id');
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            if (profile.data._id !== auth.user._id) {
                dispatch(setProfile(auth.user));
            }
        }
        const isFollowed = auth.user.following.some(
            (value) => value._id === profile.data._id
        );

        setFollowed(isFollowed);
    }, [auth.user, id, profile.data._id, dispatch]);

    useEffect(() => {
        if (id) {
            if (profile.data._id !== id) {
                dispatch(getProfile(id));
            }
        }
    }, [id, dispatch, profile.data._id]);

    const handleSettingsClose = () => {
        setIsSettingShow(false);
    };

    const handleLogout = () => {
        const action = logout();
        dispatch(action);
    };

    const handleFollow = async (followId) => {
        setLoading(true);
        const action = follow({
            followId,
            user: auth.user,
            socket: socket.data,
        });
        await dispatch(action);

        const newProfile = { ...profile.data };
        newProfile.followers = [...newProfile.followers, auth.user];
        dispatch(setProfile(newProfile));
        setFollowed(true);

        setLoading(false);
    };

    const handleUnfollow = async (unFollowId) => {
        setLoading(true);

        const action = unFollow({ unFollowId, user: auth.user });
        await dispatch(action);

        const newFollowers = profile.data.followers.filter(
            (item) => item._id !== auth.user._id
        );
        dispatch(setProfile({ ...profile.data, followers: newFollowers }));
        setFollowed(false);

        setLoading(false);
    };

    const handlePostTabActive = (type) => {
        setPostTabActive(type);
    };

    const handleNewConversation = () => {
        const isExist = message.conversations.data.findIndex(
            (item) => item._id === profile.data._id
        );
        if (isExist >= 0) {
            return history.push(`message/${profile.data._id}`);
        }
        const newConversation = {
            avatar: profile.data.avatar,
            username: profile.data.username,
            fullname: profile.data.fullname,
            _id: profile.data._id,
            text: '',
            sender: auth.user,
            media: [],
        };

        dispatch(addConversation(newConversation));

        return history.push(`message/${profile.data._id}`);
    };

    const moreList = [
        {
            label: 'Chặn người dùng này',
            isDanger: true,
            path: '/',
            handle: () => console.log('hello'),
        },
        {
            label: 'Báo cáo người dùng',
            isDanger: true,
            path: '/',

            handle: () => console.log('hello'),
        },
        {
            label: 'Hủy',
            path: '/',

            handle: () => setIsMoreModalShow(false),
        },
    ];
    const settingList = [
        {
            label: 'Đổi mật khẩu',
            path: '/account/password',
        },
        {
            label: 'Thông báo',
            path: '/account/notify',
        },
        {
            label: 'Bảo mật và quyền riêng tư',
            path: '/account/services',
        },
        {
            label: 'Hoạt động đăng nhập',
            path: '/account/login_history',
        },
        {
            label: 'Báo cáo sự cố',
            path: '',
            handle: () =>
                window.open('https://Facebook.com/quankiugl', '_blank'),
        },
        {
            label: 'Đăng xuất',
            path: '/account/logout',
            handle: handleLogout,
        },
        {
            label: 'Hủy',
            path: '/account/close',
            handle: handleSettingsClose,
        },
    ];
    return (
        <>
            {profile.loading ? (
                <Loading bg="rgba(0,0,0,0.4)" />
            ) : (
                Object.keys(profile.data).length !== 0 && (
                    <div className="profile">
                        {followListShow.isShow && (
                            <FollowListModal
                                data={followListShow.data}
                                onCloseClick={() =>
                                    setFollowListShow({
                                        isShow: false,
                                        data: [],
                                    })
                                }
                                title={followListShow.title}
                            />
                        )}

                        <Container>
                            <Row className="position-relative">
                                <Col
                                    sm="4"
                                    className="d-flex justify-content-center"
                                    children={
                                        <img
                                            className="rounded-circle"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                            }}
                                            src={profile.data.avatar}
                                            alt=""
                                        />
                                    }
                                />

                                <Col sm="8">
                                    <div className="name">
                                        <span className="username text-secondary">
                                            {profile.data.username}
                                        </span>

                                        {profile.data._id === auth.user._id ? (
                                            <Button
                                                className="btn-edit"
                                                path="account/edit"
                                                children="Chỉnh sửa trang cá nhân"
                                            />
                                        ) : followed ? (
                                            <>
                                                <Button
                                                    className="btn-inbox bg-transparent py-2 px-3"
                                                    handle={
                                                        handleNewConversation
                                                    }
                                                    children="Nhắn tin"
                                                />
                                                <Button
                                                    className="btn-follow bg-transparent py-2 px-4"
                                                    handle={() =>
                                                        handleUnfollow(
                                                            profile.data._id
                                                        )
                                                    }
                                                    children={
                                                        loading ? (
                                                            <Spinner
                                                                animation="border"
                                                                size="md"
                                                                variant="secondary"
                                                                children=""
                                                            />
                                                        ) : (
                                                            <>
                                                                <IconAccount
                                                                    style={{
                                                                        width: '1.4rem',
                                                                        height: '1.4rem',
                                                                    }}
                                                                />
                                                                <IconDone
                                                                    style={{
                                                                        width: '1.2rem',
                                                                        height: '1.2rem',
                                                                    }}
                                                                />
                                                            </>
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <Button
                                                className="btn-follow bg-primary text-white py-2 px-5 opacity-50"
                                                handle={() =>
                                                    handleFollow(
                                                        profile.data._id
                                                    )
                                                }
                                                children={
                                                    loading ? (
                                                        <Spinner
                                                            animation="border"
                                                            size="md"
                                                            variant="secondary"
                                                            children=""
                                                        />
                                                    ) : (
                                                        'Theo dõi'
                                                    )
                                                }
                                            />
                                        )}
                                        {profile.data._id !== auth.user._id && (
                                            <MoreIcon
                                                onClick={() =>
                                                    setIsMoreModalShow(true)
                                                }
                                            />
                                        )}
                                        {isMoreModalShow && (
                                            <Settings
                                                data={moreList}
                                                onCloseClick={() =>
                                                    setIsMoreModalShow(false)
                                                }
                                            />
                                        )}
                                        {isSettingShow && (
                                            <Settings
                                                data={settingList}
                                                onCloseClick={
                                                    handleSettingsClose
                                                }
                                            />
                                        )}

                                        {profile.data._id === auth.user._id && (
                                            <SettingIcon
                                                onClick={() =>
                                                    setIsSettingShow(true)
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="statistical d-flex align-items-center mt-4 mb-4">
                                        <div className="count-post">
                                            <b>{post.postUser.total}</b> bài
                                            viết
                                        </div>
                                        <div
                                            className="follow count-follower"
                                            onClick={() =>
                                                setFollowListShow({
                                                    title: 'Người theo dõi',
                                                    isShow: true,
                                                    data: id
                                                        ? profile.data.followers
                                                        : auth.user.followers,
                                                })
                                            }
                                        >
                                            <b>
                                                {profile.data.followers.length}
                                            </b>{' '}
                                            người theo dõi
                                        </div>

                                        <div
                                            className="follow count-following"
                                            onClick={() =>
                                                setFollowListShow({
                                                    title: 'Đang theo dõi',
                                                    isShow: true,
                                                    data: id
                                                        ? profile.data.following
                                                        : auth.user.following,
                                                })
                                            }
                                        >
                                            Đang theo dõi{' '}
                                            <b>
                                                {profile.data.following.length}
                                            </b>{' '}
                                            người dùng
                                        </div>
                                    </div>

                                    <div className="fullname">
                                        {profile.data.fullname}
                                    </div>
                                    <div className="story">
                                        {profile.data.story}
                                    </div>
                                </Col>
                            </Row>
                            <PostTab
                                tabActive={postTabActive}
                                user={profile.data}
                                onTabClick={handlePostTabActive}
                            />
                            <Footer />
                        </Container>
                    </div>
                )
            )}
        </>
    );
};

export default Profile;
