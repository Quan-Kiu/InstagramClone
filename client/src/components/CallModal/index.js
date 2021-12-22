import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AudioCallIcon } from '../../assets/icons';
import { setAlert } from '../../redux/reducer/alertSlice';
import { setCall } from '../../redux/reducer/callSlice';
import {
    addMessage,
    createMessage,
    getConversation,
} from '../../redux/reducer/messageSlice';
import { formatTime } from '../../utils/formatTime';
import './callmodal.scss';

const CallModal = (props) => {
    const call = useSelector((state) => state.call);
    const auth = useSelector((state) => state.auth);
    const peer = useSelector((state) => state.peer);
    const socket = useSelector((state) => state.socket);
    const dispatch = useDispatch();
    const [callTimer, setCallTimer] = useState(0);
    const [answer, setAnswer] = useState(false);
    const myVideo = useRef();
    const friendVideo = useRef();
    const [tracks, setTracks] = useState(null);
    const [newCall, setNewCall] = useState(null);
    const [hiddenModal, setHiddenModal] = useState(false);

    const openStream = (video) => {
        const config = { audio: true, video };
        return navigator.mediaDevices.getUserMedia(config);
    };

    const playStream = (tag, stream) => {
        let video = tag;
        video.srcObject = stream;
        video.play();
    };

    const handleAnswers = async (action) => {
        if (action === 'unAnswer') {
            const message = {
                sender: call.data.sender,

                recipient: call.data.recipient,

                text: '',
                icon: false,
                isRead: false,
                media: [],
                call: {
                    answer,
                    times: 0,
                    video: call.data.video,
                },
                createdAt: new Date().toISOString(),
            };
            const res = await dispatch(
                createMessage({
                    message,
                })
            );

            dispatch(
                addMessage({
                    message: res.payload.message,
                    isChatRealtime: call.data.sender !== auth.user._id,
                })
            );
            dispatch(getConversation());

            socket.data.emit('endCall', {
                call: call.data,
                user: auth.user,
                times: 0,
                message: res.payload.message,
            });

            dispatch(setCall(null));
        } else {
            openStream(call.data.video).then((stream) => {
                playStream(myVideo.current, stream);
                const track = stream.getTracks();
                setTracks(track);

                const newCall = peer.data.call(call.data.peerId, stream);
                newCall.on('stream', function (remoteStream) {
                    playStream(friendVideo.current, remoteStream);
                });
                setCallTimer(0);
                setAnswer(true);
                setNewCall(newCall);
            });
        }
    };

    useEffect(() => {
        socket.data.on('endCallToClient', ({ isRefuse, message }) => {
            tracks && tracks.forEach((track) => track.stop());
            if (newCall) newCall.close();
            if (!isRefuse) {
                dispatch(
                    setAlert({
                        type: 'bottomAlert',
                        text: `${call.data.fullname} đã kết thúc cuộc gọi.`,
                    })
                );
            }
            dispatch(
                addMessage({
                    message,
                    isChatRealtime: call.data.sender !== auth.user._id,
                })
            );
            dispatch(getConversation());

            dispatch(setCall(null));
        });
        return () => socket.data.off('endCallToClient');
    }, [socket.data, dispatch, tracks, newCall, call.data, auth.user._id]);

    useEffect(() => {
        peer.data.on('call', (newCall) => {
            openStream(call.data.video).then((stream) => {
                if (myVideo.current) {
                    playStream(myVideo.current, stream);
                }
                const track = stream.getTracks();
                setTracks(track);

                newCall.answer(stream);
                newCall.on('stream', function (remoteStream) {
                    if (friendVideo.current) {
                        playStream(friendVideo.current, remoteStream);
                    }
                });
                setCallTimer(0);
                setAnswer(true);
                setNewCall(newCall);
            });
        });
        return () => peer.data.removeListener('call');
    }, [peer.data, call.data.video]);

    useEffect(() => {
        if (!answer) {
            if (callTimer === 60000) {
                if (call.data.sender === auth.user._id) {
                    dispatch(
                        setAlert({
                            type: 'bottomAlert',
                            text: `${call.data.fullname} không tham gia.`,
                        })
                    );
                    handleAnswers('unAnswer');
                }
            }
        }

        const timer = setTimeout(() => setCallTimer(callTimer + 1000), 1000);
        return () => clearTimeout(timer);
    }, [callTimer, answer, auth.user._id, call.data, dispatch]);

    const handleEndCall = async () => {
        tracks && tracks.forEach((track) => track.stop());
        if (newCall) newCall.close();
        const message = {
            sender: call.data.sender,
            recipient: call.data.recipient,
            text: '',
            icon: false,
            isRead: false,
            media: [],
            call: {
                answer,
                times: callTimer,
                video: call.data.video,
            },
            createdAt: new Date().toISOString(),
        };
        const res = await dispatch(
            createMessage({
                message,
            })
        );

        dispatch(
            addMessage({
                message: res.payload.message,
                isChatRealtime: call.data.sender !== auth.user._id,
            })
        );
        dispatch(getConversation());

        socket.data.emit('endCall', {
            call: call.data,
            user: auth.user,
            times: callTimer,
            message: res.payload.message,
        });

        dispatch(setCall(null));
    };

    return (
        <>
            {hiddenModal && (
                <div className="show-modal ">
                    <div
                        className="content"
                        onClick={() => setHiddenModal(false)}
                    >
                        {' '}
                        Hiển thị cuộc gọi
                    </div>
                </div>
            )}
            <div className={`call-modal ${hiddenModal && 'hidden'} `}>
                <div
                    className="call-modal__close"
                    onClick={() => setHiddenModal(true)}
                >
                    &times;
                </div>
                <img src={call.data.avatar} alt="" className="call-modal__bg" />
                <div className="call-modal__container">
                    <div className="call-modal__content">
                        <div className="call-modal__avatar">
                            <img src={call.data.avatar} alt="" />
                        </div>
                        <div className="call-modal__fullname">
                            {call.data.fullname}
                        </div>
                        {answer ? (
                            <div className="call-modal__status">Đã kết nối</div>
                        ) : call.data.sender === auth.user._id ? (
                            <div className="call-modal__status">
                                Đang liên hệ...
                            </div>
                        ) : (
                            <div className="call-modal__status">
                                Đang gọi cho bạn...
                            </div>
                        )}
                        {}
                        {answer && (
                            <div className="call-timer">
                                {`${formatTime(
                                    Math.floor(callTimer / 60000)
                                )}:${formatTime((callTimer / 1000) % 60)}`}
                            </div>
                        )}

                        <div className="handle-call">
                            <div
                                className={`handle-call-container ${
                                    answer && call.data.video && 'active'
                                }`}
                            >
                                <AudioCallIcon
                                    onClick={() =>
                                        answer
                                            ? handleEndCall()
                                            : handleAnswers('unAnswer')
                                    }
                                    className="handle-call-stop"
                                />
                            </div>
                            {call.data.sender !== auth.user._id && !answer && (
                                <div className="handle-call-container">
                                    <AudioCallIcon
                                        onClick={() => handleAnswers('answer')}
                                        className="handle-call-listen"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="media-call">
                            <video
                                ref={myVideo}
                                className="my-video"
                                playsInline
                                muted
                            />
                            <video
                                ref={friendVideo}
                                className="friend-video"
                                playsInline
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

CallModal.propTypes = {};

export default CallModal;
