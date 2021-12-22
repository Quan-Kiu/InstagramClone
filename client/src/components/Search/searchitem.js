import PropTypes from 'prop-types';
import React from 'react';

const SearchItem = ({ item, onClickItem, handle, type }) => {
    return (
        <div className="search__item" onMouseDown={onClickItem}>
            <img className="search__item-avatar" src={item.avatar} alt="" />
            <div className="search__item__infos">
                <div className="search__item__infos-username">
                    {item.username}
                </div>
                <p className="search__item__infos-fullname mb-0">
                    {item.fullname}
                </p>
            </div>
            {type === 'history_search_list' && (
                <span
                    className="remove-history text-secondary"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handle.setSearchList([]);
                        handle.removeItem(item);
                    }}
                >
                    &times;
                </span>
            )}
        </div>
    );
};

SearchItem.propTypes = {
    type: PropTypes.string,
};
SearchItem.defaultProps = {
    type: '',
};

export default SearchItem;
