import React from 'react';
import { useSelector } from 'react-redux';
import FollowItem from '../components/FollowItem';
import '../scss/pages/suggestions.scss';
import Search from '../components/Search';

const Suggestions = (props) => {
    const user = useSelector((state) => state.user);
    return (
        <div className="suggestions">
            <div className="suggestions__container">
                <div className="suggestions__search">
                    <div className="suggestions__title">Tìm kiếm</div>
                    <Search />
                </div>
                <div className="suggestions__title">Gợi ý</div>
                <div className="suggestions__list">
                    {user.suggestions &&
                        user.suggestions.users.map((item, index) => {
                            return <FollowItem key={index} follower={item} />;
                        })}
                </div>
            </div>
        </div>
    );
};

export default Suggestions;
