import React from 'react';

import PropTypes from 'prop-types';

import { createFragmentContainer, graphql } from 'react-relay';

import { 
  Form,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Modal
} from 'react-bootstrap';

import Button from 'react-bootstrap-button-loader';

const propTypes = {
};

export default class CreateUserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        firstNameValidationState: null,
        lastNameValidationState: null,
        emailValidationState: null,
        phoneNumberValidationState: null,
        passwordValidationState: null
    };

    this.validateInputs = this.validateInputs.bind(this);
  }

  validateInputs() {
    var state = this.state;

    var successfulValidation = true;

    if (!this.firstName.value) {
      state.firstNameValidationState = 'error';
      successfulValidation = false;
    } else {
      state.firstNameValidationState = null;
    }

    if (!this.lastName.value) {
      state.lastNameValidationState = 'error';
      successfulValidation = false;
    } else {
      state.lastNameValidationState = null;
    }

    if (!this.email.value) {
      state.emailValidationState = 'error';
      successfulValidation = false;
    } else {
      state.emailValidationState = null;
    }

    if (!this.phoneNumber.value) {
      state.phoneNumberValidationState = 'error';
      successfulValidation = false;
    } else {
      state.phoneNumberValidationState = null;
    }

    if (!this.password.value) {
      state.passwordValidationState = 'error';
      successfulValidation = false;
    } else {
      state.password = null;
    }

    this.setState(state);

    return successfulValidation;
  }

  render() {
    return (
      <Form horizontal>
        <h3>Admin User Information</h3>

        <FormGroup controlId="firstName" validationState={this.state.firstNameValidationState}>
          <Col componentClass={ControlLabel} sm={2}>
            First Name
          </Col>
          <Col sm={10}>
            <FormControl  inputRef={(ref) => {this.firstName = ref}} type="text" />
          </Col>
        </FormGroup>

        <FormGroup controlId="lastName" validationState={this.state.lastNameValidationState}>
          <Col componentClass={ControlLabel} sm={2} >
            Last Name
          </Col>
          <Col sm={10}>
            <FormControl inputRef={(ref) => {this.lastName = ref}} type="text" />
          </Col>
        </FormGroup>

        <FormGroup controlId="phoneNumber" validationState={this.state.phoneNumberValidationState}>
          <Col componentClass={ControlLabel} sm={2}>
            Phone Number
          </Col>
          <Col sm={10}>
            <FormControl inputRef={(ref) => {this.phoneNumber = ref}} type="text" />
          </Col>
        </FormGroup>

        <FormGroup controlId="email" validationState={this.state.emailValidationState}>
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl inputRef={(ref) => {this.email = ref}} type="email" />
          </Col>
        </FormGroup>

        <FormGroup controlId="password" validationState={this.state.passwordValidationState}>
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl inputRef={(ref) => {this.password = ref}} type="password" />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

CreateUserForm.propTypes = propTypes;
