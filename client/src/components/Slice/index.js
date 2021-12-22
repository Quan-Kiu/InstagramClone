import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconArrowLeft, IconArrowRight } from '../../assets/icons';
import './slice.scss';

const Slice = ({ images }, props) => {
    const [currentSlice, setCurrentSlice] = useState(0);
    const [indexImage, setIndexImage] = useState(0);
    const imagesRef = useRef(<div></div>);

    const handleNextImage = () => {
        const tsl = currentSlice - imagesRef.current.offsetWidth;
        imagesRef.current.style.transform = `translateX(${tsl}px)`;
        setCurrentSlice(tsl);
    };
    const handlePrevImage = () => {
        const tsl = currentSlice + imagesRef.current.offsetWidth;
        imagesRef.current.style.transform = `translateX(${tsl}px)`;
        setCurrentSlice(tsl);
    };

    useEffect(() => {
        setIndexImage(-(currentSlice / imagesRef.current.offsetWidth));
        props.handle &&
            props.handle(-(currentSlice / imagesRef.current.offsetWidth));
    }, [currentSlice, props]);
    return (
        <div className="media-post">
            {images.length > 1 && (
                <div className="media-control">
                    {indexImage !== 0 && (
                        <IconArrowLeft
                            className="prev-control"
                            onClick={handlePrevImage}
                        />
                    )}
                    {indexImage !== images.length - 1 && (
                        <IconArrowRight
                            className="next-control"
                            onClick={handleNextImage}
                        />
                    )}
                </div>
            )}
            <div className="image__list" ref={imagesRef}>
                {images.map((image, index) =>
                    image.url.match(/video/i) ? (
                        <video key={index} className="my-video" controls>
                            <source src={image.url} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            key={index}
                            className="my-image"
                            src={image.url}
                            alt={image.public_id}
                        />
                    )
                )}
            </div>
        </div>
    );
};

Slice.propTypes = {
    images: PropTypes.array,
    handle: PropTypes.func,
};

Slice.defaultProps = {
    images: [],
    handle: null,
};

export default Slice;
