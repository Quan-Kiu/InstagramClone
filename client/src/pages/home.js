import React from 'react';
import { Col, Row } from 'reactstrap';
import PostsHome from '../components/PostsHome';
import RightBar from '../components/RightBar';
import TopAlert from '../components/TopAlert';
import '../scss/pages/home.scss';
const home = () => {
    return (
        <div className="home container">
            <Row>
                <Col md={8} sm={12} className="posts-home">
                    <TopAlert />
                    <PostsHome />
                </Col>
                <Col md={4} sm={12} className="side-bar">
                    <RightBar />
                </Col>
            </Row>
        </div>
    );
};

export default home;
