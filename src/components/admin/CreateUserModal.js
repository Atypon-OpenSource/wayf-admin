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
  Modal,
  Grid,
  Alert
} from 'react-bootstrap';

import Button from 'react-bootstrap-button-loader';
import CreateUserMutation from '../../mutations/CreateUserMutation';
import CreateUserForm from './CreateUserForm';
import ConfirmationModal from '../common/ConfirmationModal';

const propTypes = {
  relay: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default class CreateUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.submit = this.submit.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.getModalBodies = this.getModalBodies.bind(this);
    this.createConfirmationModal = this.createConfirmationModal.bind(this);
    this.success = this.success.bind(this);
    this.buildSuccessBody = this.buildSuccessBody.bind(this);
    this.buildDefaultBody = this.buildDefaultBody.bind(this);
    this.close = this.close.bind(this);
  }

  validateInputs() {
    return this.createUserForm.validateInputs();
  }

  submit(successFn, failureFn) {
    CreateUserMutation.commit(
          this.props.relay.environment,
          this.createUserForm.firstName.value,
          this.createUserForm.lastName.value,
          this.createUserForm.phoneNumber.value,
          this.createUserForm.email.value,
          this.createUserForm.password.value,
          successFn
    );
  }

  success(response) {
    var state = this.state;
    state.newUserName = response.createUser.user.firstName + ' ' + response.createUser.user.lastName;
    this.setState(state);
  }

  close() {
    var state = this.state;
    state.newUserName = null;
    this.setState(state);

    this.props.onClose();
  }

  getFunctions() {
    var functions = {
      submit: this.submit,
      validateInputs: this.validateInputs,
      success: this.success,
      close: this.close,
      cancel: this.close
    }

    return functions;
  }

  buildSuccessBody() {
    return (<p>Success! A new administrator account has been created for {this.state.newUserName}.</p>);
  }

  buildDefaultBody() {
    return (<CreateUserForm ref={instance => {this.createUserForm = instance; }} />);
  }

  getModalBodies() {
    var bodies = {
      success: this.buildSuccessBody,
      default: this.buildDefaultBody
    }; 

    return bodies;
  }

  createConfirmationModal() {
    var bodies = this.getModalBodies();
    var functions = this.getFunctions();
    return (<ConfirmationModal relay={this.props.relay} title="Create New Administrator" bodies={bodies} functions={functions} />);
  }


  render() {
    return this.createConfirmationModal();
  }
}

CreateUserModal.propTypes = propTypes;
