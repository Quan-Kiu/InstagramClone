import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { ErrorMessage } from 'formik';

const InputField = (props) => {
    const { field, form, label, placeholder, type, disabled } = props;
    const { name } = field;
    const { errors, touched } = form;
    const isError = errors[name] && touched[name];
    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}
            <div className="input">
                <Input
                    id={name}
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    invalid={isError}
                    children={props.children}
                ></Input>
                <ErrorMessage name={name} component={FormFeedback} />
                <div className="sub-input text-secondary">{props.subinput}</div>
            </div>
        </FormGroup>
    );
};

InputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    subinput: PropTypes.object,
};

InputField.defaultProps = {
    type: 'text',
    disabled: false,
    label: '',
    placeholder: '',
    subinput: null,
};

export default InputField;
