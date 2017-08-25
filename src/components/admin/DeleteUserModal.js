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
import DeleteUserMutation from '../../mutations/DeleteUserMutation';
import CreateUserForm from './CreateUserForm';
import ConfirmationModal from '../common/ConfirmationModal';

const propTypes = {
  relay: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default class DeleteUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.submit = this.submit.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.getModalBodies = this.getModalBodies.bind(this);
    this.createConfirmationModal = this.createConfirmationModal.bind(this);
    this.buildSuccessBody = this.buildSuccessBody.bind(this);
    this.buildDefaultBody = this.buildDefaultBody.bind(this);
    this.close = this.close.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  submit(successFn, failureFn) {
    DeleteUserMutation.commit(
          this.props.relay.environment,
          this.props.user.adminUserId,
          successFn
    );
  }

  close() {
    this.props.onClose();
  }

  cancel() {
    this.props.onCancel();
  }

  getFunctions() {
    var functions = {
      submit: this.submit,
      close: this.close,
      cancel: this.cancel
    }

    return functions;
  }

  getUserName() {
    return this.props.user.firstName + ' ' + this.props.user.lastName;
  }

  buildSuccessBody() {
    return (<p>Success! The Administrator, <strong>{this.getUserName()}</strong>, has been deleted.</p>);
  }

  buildDefaultBody() {
    return (<p>Are you sure you want to delete Administrator <strong>{this.getUserName()}</strong>?</p>);
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
    return (<ConfirmationModal relay={this.props.relay} title="Delete Administrator" bodies={bodies} functions={functions} />);
  }


  render() {
    return this.createConfirmationModal();
  }
}

DeleteUserModal.propTypes = propTypes;
