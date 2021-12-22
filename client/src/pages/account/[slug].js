import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import './account.scss';
const AccountEdit = (props) => {
    const [tabRender, setTabRender] = useState(<></>);
    const { action } = useParams();

    const generateTab = (tabName) => {
        const component = () => require(`./tabs/${tabName}`).default;

        try {
            return React.createElement(component());
        } catch (error) {
            return (
                <div
                    className="text-secondary text-center h-100 fw-bold user-select-none"
                    style={{ fontSize: '1.6rem' }}
                >
                    Đang xây dựng
                </div>
            );
        }
    };

    useEffect(() => {
        setTabRender(generateTab(action));
    }, [action]);
    return (
        <>
            <Container className="account-edit">
                <Row>
                    <Col md={3} className="left-content">
                        <div className="left-content__list">
                            <NavLink to="edit" activeClassName="active">
                                Chỉnh sửa trang cá nhân
                            </NavLink>
                            <NavLink to="password" activeClassName="active">
                                Đổi mật khẩu
                            </NavLink>
                            <NavLink to="mail" activeClassName="active">
                                Email và SMS
                            </NavLink>
                            <NavLink to="notify">Thông báo đẩy</NavLink>
                            <NavLink to="menu" activeClassName="active">
                                Quản lý danh bạ
                            </NavLink>
                            <NavLink to="services" activeClassName="active">
                                Bảo mật và quyền riêng tư
                            </NavLink>
                            <NavLink
                                to="login_history"
                                activeClassName="active"
                            >
                                Hoạt động đăng nhập
                            </NavLink>
                        </div>
                    </Col>
                    <Col md={9} className="right-content">
                        {tabRender}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AccountEdit;
