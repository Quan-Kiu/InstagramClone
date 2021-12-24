import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Login from '../pages/login';

const generatePage = (pageName, auth) => {
    const component = () => require(`../pages/${pageName}`).default;

    try {
        return React.createElement(component());
    } catch (e) {
        if (auth.token) return <NotFound />;
        return <Login />;
    }
};

const PageRender = () => {
    const { page, action } = useParams();
    const auth = useSelector((state) => state.auth);
    let pageName = '';

    if (auth.token) {
        if (page !== 'login' && page !== 'register') {
            if (action) pageName = `${page}/[slug]`;
            else pageName = page;
        }
    } else {
        if (page === 'register') {
            pageName = `${page}${action ? '/' + action : ''}`;
        }
    }
    return generatePage(pageName, auth);
};

export default PageRender;
