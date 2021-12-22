import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { authApi } from '../../api/authApi';
import { IconSearch } from '../../assets/icons';
import './search.scss';
import SearchItem from './searchitem';
const Search = () => {
    const [isShow, setIsShow] = useState(false);
    const inputRef = useRef();
    const auth = useSelector((state) => state.auth);
    const [searchList, setSearchList] = useState([]);
    const historySearch =
        JSON.parse(localStorage.getItem('historySearch')) || [];
    const typingTimeoutRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const handleSaveHistoryItem = (item) => {
        inputRef.current.value = '';
        setSearchList([]);
        const historySearch =
            JSON.parse(localStorage.getItem('historySearch')) || [];

        const user = {
            _id: item._id,
            username: item.username,
            fullname: item.fullname,
            avatar: item.avatar,
        };
        const indexOfItem = historySearch.findIndex(
            (item) => item._id === user._id
        );
        if (indexOfItem >= 0) {
            historySearch.splice(indexOfItem, 1);
        }
        localStorage.setItem(
            'historySearch',
            JSON.stringify([user, ...historySearch])
        );
    };

    const handleRemoveHistoryItem = (item) => {
        const indexOfItem = historySearch.indexOf(item);
        if (indexOfItem > -1) historySearch.splice(indexOfItem, 1);
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    };

    const handleFilterChange = () => {
        setIsLoading(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(async () => {
            const search = inputRef.current.value
                .toLowerCase()
                .replace(/ /g, '');
            if (!search) {
                setSearchList([]);
            } else if (auth.token) {
                try {
                    const { users } = await authApi.getData(
                        `search?username=${search}`,
                        auth.token
                    );

                    setSearchList(users);
                } catch (error) {
                    setSearchList([]);
                }
            }
            setIsLoading(false);
        }, 300);
    };

    return (
        <div className="search">
            <input
                type="text"
                ref={inputRef}
                placeholder="Tìm kiếm"
                onFocus={() => {
                    setIsShow(true);
                }}
                onBlur={() => setIsShow(false)}
                onChange={handleFilterChange}
            />
            <IconSearch />
            {isShow && (
                <div
                    className="search__close"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        inputRef.current.value = '';
                        setSearchList([]);
                    }}
                >
                    {isLoading ? (
                        <Spinner
                            animation="border"
                            size="sm"
                            variant="secondary"
                            children=""
                        />
                    ) : (
                        <span className="close">&times;</span>
                    )}
                </div>
            )}
            {isShow && (
                <div className="search__content position-absolute">
                    <div className="search__list">
                        {!searchList.length > 0 && !inputRef.current.value && (
                            <div className="title">
                                <span>Gần đây</span>
                                {historySearch.length > 0 &&
                                    !inputRef.current.value && (
                                        <span
                                            className="clear-history text-primary"
                                            onMouseDown={(e) => {
                                                localStorage.removeItem(
                                                    'historySearch'
                                                );
                                            }}
                                        >
                                            Xóa tất cả
                                        </span>
                                    )}
                            </div>
                        )}
                        {searchList.length > 0 ? (
                            searchList.map((item, index) => (
                                <SearchItem
                                    key={index}
                                    item={item}
                                    onClickItem={() => {
                                        handleSaveHistoryItem(item);
                                        history.push(`/profile?id=${item._id}`);
                                    }}
                                />
                            ))
                        ) : inputRef.current.value ? (
                            <div className="text-secondary not-data">
                                {isLoading ? (
                                    <Spinner
                                        animation="border"
                                        size="lg"
                                        variant="secondary"
                                        children=""
                                    />
                                ) : (
                                    'Không tìm thấy nội dung.'
                                )}
                            </div>
                        ) : historySearch.length > 0 ? (
                            historySearch.map((item, index) => (
                                <SearchItem
                                    key={index}
                                    item={item}
                                    onClickItem={() =>
                                        history.push(`/profile?id=${item._id}`)
                                    }
                                    type={'history_search_list'}
                                    handle={{
                                        removeItem: handleRemoveHistoryItem,
                                        setSearchList: setSearchList,
                                    }}
                                />
                            ))
                        ) : (
                            <p className="text-secondary not-data">
                                Không có nội dung tìm kiếm mới đây.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
