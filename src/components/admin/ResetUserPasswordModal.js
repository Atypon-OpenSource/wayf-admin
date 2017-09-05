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

import ResetUserPasswordMutation from '../../mutations/ResetUserPasswordMutation';
import ResetUserPasswordForm from './ResetUserPasswordForm';
import ConfirmationModal from '../common/ConfirmationModal';

const propTypes = {
  relay: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default class ResetUserPasswordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.submit = this.submit.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.getModalBodies = this.getModalBodies.bind(this);
    this.createConfirmationModal = this.createConfirmationModal.bind(this);
    this.buildSuccessBody = this.buildSuccessBody.bind(this);
    this.buildDefaultBody = this.buildDefaultBody.bind(this);
    this.close = this.close.bind(this);
    this.buildUsername = this.buildUsername.bind(this);
  }

  validateInputs() {
    return this.resetUserPasswordForm.validateInputs();
  }

  submit(successFn, failureFn) {
    ResetUserPasswordMutation.commit(
          this.props.relay.environment,
          this.props.user.adminUserId,
          this.resetUserPasswordForm.password.value,
          successFn,
          failureFn
    );
  }

  buildUsername() {
    return this.props.user.firstName + ' ' + this.props.user.lastName;
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
      close: this.close,
      cancel: this.close
    }

    return functions;
  }

  buildSuccessBody() {
    return (<p>Success! The password has been reset for {this.buildUsername()}.</p>);
  }

  buildDefaultBody() {
    return (<ResetUserPasswordForm ref={instance => {this.resetUserPasswordForm = instance; }} user={this.props.user} />);
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
    return (<ConfirmationModal relay={this.props.relay} title="Reset Password" bodies={bodies} functions={functions} />);
  }


  render() {
    return this.createConfirmationModal();
  }
}

ResetUserPasswordModal.propTypes = propTypes;
