import React, { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import '../../scss/pages/message.scss';
import LeftContent from './Left-Content/left-content';
import RightContent from './Right-Content/right-content';
import NewMessageModal from './NewMessageModal';

const Message = () => {
    const [newMessageModalShow, setIsNewMessageModalShow] = useState(false);
    return (
        <Container className="message">
            {newMessageModalShow && (
                <NewMessageModal
                    onClose={() => setIsNewMessageModalShow(false)}
                />
            )}
            <Row>
                <Col md={4} className="left">
                    <LeftContent
                        onCreateMessageClick={() =>
                            setIsNewMessageModalShow(true)
                        }
                    />
                </Col>
                <Col md={8} className="right">
                    <RightContent
                        onCreateMessageClick={() =>
                            setIsNewMessageModalShow(true)
                        }
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Message;
