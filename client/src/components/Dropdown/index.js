import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PersonOutlineIcon, SaveIcon, SettingIcon } from '../../assets/icons';
import './dropdown.scss';

const links = [
    {
        label: 'Trang cá nhân',
        path: `/profile`,
        icon: <PersonOutlineIcon />,
    },
    {
        label: 'Đã lưu',
        path: '/saved',
        icon: <SaveIcon />,
    },
    {
        label: 'Cài đặt',
        path: '/account/edit',
        icon: <SettingIcon />,
    },
];

const Dropdown = (props) => {
    const dropdownRef = useRef();
    const inputRef = useRef();
    const [isShow, setIsShow] = useState(false);
    const history = useHistory();

    return (
        <div className="dropdown">
            <input ref={inputRef} onBlur={() => setIsShow(false)} />
            <div
                className={`dropdown__btn ${isShow ? 'active' : ''}`}
                onClick={() => {
                    inputRef.current.focus();
                    setIsShow(!isShow);
                }}
            >
                <img ref={dropdownRef} src={props.image} alt="" />
            </div>

            <div className={`dropdown-menu`}>
                {links.map((link, index) => (
                    <div
                        onMouseDown={() => history.push(link.path)}
                        className="dropdown-item"
                        key={index}
                    >
                        {link.icon}
                        {link.label}
                    </div>
                ))}
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onMouseDown={props.onLogout}>
                    Đăng xuất
                </div>
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    image: PropTypes.string,
    onLogout: PropTypes.func,
};
Dropdown.defaultProps = {
    image: '',
    onLogout: null,
};

export default Dropdown;
