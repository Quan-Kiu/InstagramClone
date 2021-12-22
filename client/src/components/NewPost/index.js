import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
    BackIcon,
    IconArrowLeft,
    IconArrowRight,
    MediaIcon,
} from '../../assets/icons';
import { DoneImage } from '../../assets/images';
import FileInputField from '../../custom-field/FileInputField';
import { setAlert } from '../../redux/reducer/alertSlice';
import { createNotify } from '../../redux/reducer/notifySlice';
import { createPost, handleSuccess } from '../../redux/reducer/postSlice';
import { checkImage, uploadImage } from '../../utils/handleImageUpload';
import Icons from '../Icons';
import Loader2 from '../Loader2';
import Settings from '../Settings';
import './newpost.scss';

const NewPost = (props) => {
    const auth = useSelector((state) => state.auth);
    const post = useSelector((state) => state.post);
    const socket = useSelector((state) => state.socket);
    const [files, setFiles] = useState([]);
    const contentTextRef = useRef(<></>);
    const [contentText, setContentText] = useState('');
    const [isSettingShow, setIsSettingShow] = useState(false);
    const [imageActive, setImageActive] = useState(0);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const handleInputChange = (e) => {
        const imagelst = e.target['files'];
        let error;
        for (const item of imagelst) {
            error = checkImage(item);
            if (error) {
                dispatch(setAlert({ type: 'bottomAlert', text: error }));
                break;
            }
        }
        if (!error) {
            setFiles(imagelst);
        }
    };

    const settingData = [
        {
            label: 'Bỏ',
            isDanger: true,
            path: '/',
            handle: () => {
                setFiles([]);
                setIsSettingShow(false);
                props.onClose();
            },
        },
        {
            label: 'Hủy',
            path: '/',
            handle: () => {
                setIsSettingShow(false);
            },
        },
    ];

    const handleSetContent = (content) => {
        contentTextRef.current.value = content;
        setContentText(contentTextRef.current.value);
    };

    const handleShareSubmit = async () => {
        setIsLoading(true);
        const imageArrayUrl = await uploadImage(files);

        if (imageArrayUrl) {
            const newPost = {
                content: contentText,
                images: imageArrayUrl,
            };
            const res = await dispatch(createPost(newPost));

            const notify = {
                id: res.payload.post._id,
                text: 'Vừa thêm bài đăng mới.',
                recipients: res.payload.user.followers,
                url: `post/${res.payload.post._id}`,
                content: '',
                image: imageArrayUrl[0].url,
            };
            await dispatch(createNotify(notify));
            dispatch(setAlert({ type: 'newPostAlert', text: 'Bài viết mới.' }));
            socket.data.emit('newPost', res.payload.user);
        }

        setIsLoading(false);
        if (post.error) {
            dispatch(setAlert({ type: 'bottomAlert', text: post.error }));
        }
    };
    return (
        <>
            {isLoading && (
                <Settings
                    className="modal-create-post"
                    title="Đang chia sẻ bài viết"
                    children={<Loader2 />}
                />
            )}
            {post.success && (
                <Settings
                    className="modal-create-post"
                    title="Đã chia sẻ bài viết"
                    onCloseClick={() => {
                        history.push('/');
                        setFiles([]);
                        props.onClose();
                        dispatch(handleSuccess());
                    }}
                    children={
                        <div className="modal-create-post__success">
                            <img src={DoneImage} alt="" />
                            Đã chia sẻ bài viết của bạn.
                        </div>
                    }
                />
            )}

            {isSettingShow && (
                <Settings
                    onCloseClick={() => setIsSettingShow(false)}
                    data={settingData}
                    title="Bỏ bài viết?"
                    subTitle="Nếu rời đi, bạn sẽ mất những gì vừa chỉnh sửa."
                />
            )}
            <div
                className="new-post"
                onClick={() => {
                    if (files.length > 0) {
                        setIsSettingShow(true);
                    } else {
                        setFiles([]);

                        props.onClose();
                    }
                }}
            >
                <div
                    className="new-post__content slice-in-bck-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="title d-flex align-items-center justify-content-between px-4">
                        {files.length > 0 && (
                            <BackIcon onClick={() => setIsSettingShow(true)} />
                        )}
                        <span>Tạo bài viết mới</span>
                        {files.length > 0 && (
                            <div
                                className="share-post text-primary"
                                onClick={handleShareSubmit}
                            >
                                Chia sẻ
                            </div>
                        )}
                    </div>
                    <div className="body">
                        {files.length <= 0 ? (
                            <div className="upload-media">
                                <MediaIcon />
                                <p>Kéo ảnh và video vào đây.</p>
                                <FileInputField
                                    onInputChange={handleInputChange}
                                    multiple={true}
                                />
                            </div>
                        ) : (
                            <div className="upload-post d-flex">
                                <div className="media-post">
                                    {files.length > 1 && (
                                        <div className="control">
                                            {imageActive !== 0 && (
                                                <IconArrowLeft
                                                    onClick={() => {
                                                        const prevImage =
                                                            imageActive - 1;
                                                        setImageActive(
                                                            prevImage
                                                        );
                                                    }}
                                                />
                                            )}
                                            <div className="center"></div>
                                            {imageActive !==
                                                files.length - 1 && (
                                                <IconArrowRight
                                                    onClick={() => {
                                                        const nextImage =
                                                            imageActive + 1;
                                                        setImageActive(
                                                            nextImage
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {files.length > 0 &&
                                        Array.from(files).map((item, index) => (
                                            <div
                                                key={index}
                                                className={`media-post-item ${
                                                    index === imageActive
                                                        ? 'active'
                                                        : ''
                                                }`}
                                            >
                                                {files[imageActive].type.match(
                                                    /video/i
                                                ) ? (
                                                    <video controls>
                                                        <source
                                                            src={URL.createObjectURL(
                                                                item
                                                            )}
                                                            type="video/mp4"
                                                        />
                                                    </video>
                                                ) : (
                                                    <img
                                                        src={URL.createObjectURL(
                                                            item
                                                        )}
                                                        alt={URL.createObjectURL(
                                                            item
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>
                                <div className="content-post">
                                    <div className="actor">
                                        <img
                                            className="avatar"
                                            src={auth.user.avatar}
                                            alt=""
                                        />
                                        <div className="username">
                                            {auth.user.username}
                                        </div>
                                    </div>
                                    <div className="content">
                                        <textarea
                                            maxLength="2000"
                                            ref={contentTextRef}
                                            onChange={(e) =>
                                                setContentText(
                                                    e.currentTarget.value
                                                )
                                            }
                                            placeholder="Viết chú thích..."
                                        ></textarea>
                                    </div>
                                    <div className="icon d-flex ">
                                        <Icons
                                            content={
                                                contentTextRef.current.value
                                            }
                                            setContent={handleSetContent}
                                        />
                                        <p>
                                            {contentText.length}
                                            /2,000
                                        </p>
                                    </div>
                                    <div className="more">
                                        <div className="more__list">
                                            <div className="more__item">
                                                Thêm vị trí
                                            </div>
                                            <div className="more__item">
                                                Trợ năng
                                            </div>
                                            <div className="more__item">
                                                Cài đặt nâng cao
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

NewPost.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default NewPost;
