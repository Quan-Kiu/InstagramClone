import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/reducer/alertSlice';
import { getPosts, updatePagePostHome } from '../../redux/reducer/postSlice';
import Loading1 from '../Loading1';
import PostItem from '../PostItem';
import './postshome.scss';

const PostsHome = (props) => {
    const post = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingComponent, setLoadingComponent] = useState(
        <div className="d-flex justify-content-center align-items-center mt-4">
            <Loading1 />
        </div>
    );

    const handleScroll = useCallback(async () => {
        if (
            window.innerHeight + window.pageYOffset >=
            document.body.offsetHeight
        ) {
            if (!isLoading) {
                setIsLoading(true);
                const res = await dispatch(
                    getPosts({ page: post.postHome.page + 1, limit: 20 })
                );
                if (res.payload.total > 0) {
                    dispatch(updatePagePostHome());
                    setIsLoading(false);
                } else {
                    window.removeEventListener('scroll', handleScroll);

                    dispatch(
                        setAlert({
                            type: 'bottomAlert',
                            text: 'Bạn đã xem hết bài viết.',
                        })
                    );
                    setLoadingComponent(<></>);
                }
            }
        }
    }, [isLoading, dispatch, post.postHome.page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        return () => {
            setIsLoading(false);
            setLoadingComponent(<></>);
        };
    }, []);

    return (
        <>
            {post.loading && loadingComponent}
            <div className="post-list">
                {post.postHome.posts.map((post, index) => (
                    <PostItem post={post} key={index} />
                ))}
            </div>
            {isLoading && loadingComponent}
        </>
    );
};

PostsHome.propTypes = {};

export default PostsHome;
