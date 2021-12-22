import React, { useState } from 'react';
import { EmojiIcon } from '../../assets/icons';
import './icons.scss';

const Icons = ({ setContent, content }) => {
    const [isDropdownIconShow, setIsDropdownIconShow] = useState(false);
    const reactions = [
        '❤️',
        '😆',
        '😯',
        '😢',
        '😡',
        '👍',
        '👎',
        '😄',
        '😂',
        '😍',
        '😘',
        '😗',
        '😚',
        '😳',
        '😭',
        '😓',
        '😤',
        '🤤',
        '👻',
        '💀',
        '🤐',
        '😴',
        '😷',
        '😵',
    ];

    return (
        <div className="icons">
            <span
                className="position-relative p-0"
                onClick={() => setIsDropdownIconShow(!isDropdownIconShow)}
            >
                <span
                    style={{
                        opacity: 0.5,
                        fontSize: '1.6rem',
                        cursor: 'pointer',
                    }}
                >
                    <EmojiIcon />
                </span>
            </span>
            {isDropdownIconShow && (
                <>
                    <div
                        className="icon__content"
                        onClick={() => setIsDropdownIconShow(false)}
                    ></div>
                    <div
                        className="icons__list"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="reactions">
                            {reactions.map((icon) => (
                                <span
                                    key={icon}
                                    onClick={() =>
                                        setContent(
                                            content ? content + icon : '' + icon
                                        )
                                    }
                                >
                                    {icon}
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Icons;
