import React from 'react';

import PropTypes from 'prop-types';

import { createFragmentContainer, graphql } from 'react-relay';
import cookie from 'react-cookies'

import { 
  Form,
  Col,
  Grid,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Modal,
  Row,
  Alert,
  Glyphicon,
} from 'react-bootstrap';

 import Button from 'react-bootstrap-button-loader';
import AdminLoginMutation from '../../mutations/AdminLoginMutation';

const propTypes = {
  relay: PropTypes.object.isRequired,
  success: PropTypes.func.isRequired
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        emailValidationState: null,
        passwordValidationState: null,
        loading: false,
        loginError: false
    };

    this.validateInputs = this.validateInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.getAlert = this.getAlert.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleSubmit() {
    var validInputs = this.validateInputs();

    if (!validInputs) {
      return;
    }

    this.setState({disableSubmit: true, loading: true});

    AdminLoginMutation.commit(
          this.props.relay.environment,
          this.email.value,
          this.password.value,
          this.handleSuccess,
          this.handleError
    );
  }

  validateInputs() {
    var state = this.state;

    var successfulValidation = true;

    if (!this.email.value) {
      state.emailValidationState = 'error';
      successfulValidation = false;
    } else {
      state.emailValidationState = null;
    }

    if (!this.password.value) {
      state.passwordValidationState = 'error';
      successfulValidation = false;
    } else {
      state.passwordValidationState = null;
    }

    this.setState(state);

    return successfulValidation;
  }

  handleSuccess(mutationResponse) {
    let token = mutationResponse.adminLogin.token.value;

    cookie.save('adminToken', token, { path: '/' });

    var state = this.state;
    state.loading = false;
    state.loginError = false;
    this.setState(state);

    this.props.success();
  }

  handleError(error) {
    var state = this.state;
    state.loading = false;
    state.loginError = true;
    this.setState(state);
  }

  getAlert() {
    if (this.state.loginError) {
      return (<Alert bsStyle="danger"><Glyphicon glyph="remove" />&nbsp;Login Failure! Please check your credentials and try again.</Alert>);
    }
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={3}></Col>
          <Col sm={6}><h3>Please Login</h3></Col>
        </Row>
        <Row>
          <Col sm={3}></Col>
          <Col sm={6}>{this.getAlert()}</Col>
        </Row>
        <Form horizontal>
          <FormGroup controlId="email" validationState={this.state.emailValidationState}>
            <Col componentClass={ControlLabel} sm={3}>
              Email Address
            </Col>
            <Col sm={6}>
              <FormControl inputRef={ref => { this.email = ref; }} type="text" />
            </Col>
          </FormGroup>

          <FormGroup controlId="password" validationState={this.state.passwordValidationState}>
            <Col componentClass={ControlLabel} sm={3}>
              Password
            </Col>
            <Col sm={6}>
              <FormControl  inputRef={(ref) => {this.password = ref}} type="password" />
            </Col>
          </FormGroup>
        </Form>
        <Row>
          <Col sm={3} />
          <Col sm={6}>
            <Button type="submit" loading={this.state.loading} spinColor='#000'  onClick={this.handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Login.propTypes = propTypes;
