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

const propTypes = {
    user: PropTypes.object.isRequired
};

export default class ResetUserPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        passwordValidationState: null
    };

    this.validateInputs = this.validateInputs.bind(this);
    this.buildUsername = this.buildUsername.bind(this);
  }

  validateInputs() {
    var state = this.state;

    var successfulValidation = true;

    if (!this.password.value) {
      state.passwordValidationState = 'error';
      successfulValidation = false;
    } else {
      state.password = null;
    }

    this.setState(state);

    return successfulValidation;
  }

  buildUsername() {
    return this.props.user.firstName + ' ' + this.props.user.lastName;
  }

  render() {
    return (
      <Form horizontal>
        <h3>New Password for {this.buildUsername()}</h3>

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

ResetUserPassword.propTypes = propTypes;
