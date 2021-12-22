import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/reducer/alertSlice';
import './bottomalert.scss';

const BottomAlert = (props) => {
    const alert = useSelector((state) => state.alert);
    const dispatch = useDispatch();
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setAlert({ type: 'bottomAlert', text: '' }));
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, [props, dispatch]);

    return <div className="bottom-alert">{alert.bottomAlert}</div>;
};

export default BottomAlert;
