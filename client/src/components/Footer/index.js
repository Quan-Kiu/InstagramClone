import React from 'react';
import './footer.scss';
const footerLinks = [
    {
        label: 'QK',
        path: '/',
    },
    {
        label: 'Giới thiệu',
        path: '/',
    },
    {
        label: 'Blog',
        path: '/',
    },
    {
        label: 'Việc làm',
        path: '/',
    },
    {
        label: 'Trợ giúp',
        path: '/',
    },
    {
        label: 'API',
        path: '/',
    },
    {
        label: 'Quyền riêng tư',
        path: '/',
    },
    {
        label: 'Điều khoản',
        path: '/',
    },
    {
        label: 'Tài khoản liên quan nhất',
        path: '/',
    },
    {
        label: 'Hashtag',
        path: '/',
    },
    {
        label: 'Vị trí',
        path: '/',
    },
    {
        label: 'Instagram Lite',
        path: '/',
    },
    {
        label: 'Làm đẹp',
        path: '/',
    },
    {
        label: 'Khiêu vũ',
        path: '/',
    },
    {
        label: 'Thể dục',
        path: '/',
    },
    {
        label: 'Ẩm thực',
        path: '/',
    },
    {
        label: 'Nhà & vườn',
        path: '/',
    },
    {
        label: 'Âm nhạc',
        path: '/',
    },
    {
        label: 'Nghệ thuật thị giác',
        path: '/',
    },
];

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__link">
                    {footerLinks.map((link, index) => (
                        <a
                            className="footer__link__item"
                            target="_blank"
                            rel="noreferrer"
                            href={link.path}
                            key={index}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <div className="copyright text-center mb-5 mt-5 opacity-50">
                    © 2021 Instagram Clone from QK
                </div>
            </div>
        </footer>
    );
};

export default Footer;
