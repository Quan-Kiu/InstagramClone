import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';
import './fileinputfield.scss';

const FileInputField = (props) => {
    const { name, label, other } = props;

    return (
        <FormGroup>
            {label && (
                <Label className="align-self-center" for={name}>
                    {label}
                </Label>
            )}
            <div className="input">
                {other && <div className="username">{other.username}</div>}

                <Input
                    id={name}
                    type="file"
                    multiple={props.multiple}
                    accept="image/*,video/*"
                    onChange={props.onInputChange}
                />
            </div>
        </FormGroup>
    );
};

FileInputField.propTypes = {
    name: PropTypes.string,
    label: PropTypes.any,
    other: PropTypes.object,
    onInputChange: PropTypes.func,
    multiple: PropTypes.bool,
};
FileInputField.defaultProps = {
    name: '',
    label: null,
    other: null,
    onInputChange: null,
    multiple: false,
};

export default FileInputField;
