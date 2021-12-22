import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import MyPost from '../components/MyPost';
import '../scss/pages/explore.scss';

const Discover = (props) => {
    const post = useSelector((state) => state.post);

    return (
        <Container>
            <div className="explore">
                {post.postsExplore.length > 0 && (
                    <div className="explore__list">
                        {post.postsExplore.map((item, index) => (
                            <MyPost key={index} post={item} />
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Discover;
