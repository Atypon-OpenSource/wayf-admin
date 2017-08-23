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

const propTypes = {
  relay: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  publisherRegistration: PropTypes.object
};

export default class CreateUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        showModal: true,
        loading: false,
        showSuccessAlert: false,
        successfulCreation: false
    };

    this.hideSuccessAlert = this.hideSuccessAlert.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.successfulCreation = this.successfulCreation.bind(this);
    this.getModalBody = this.getModalBody.bind(this);
    this.getModalBottomPanel = this.getModalBottomPanel.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  successfulCreation(mutationResponse) {
    var state = this.state;
    state.loading = false;
    state.successfulCreation = true;
    state.showSuccessAlert = true;

    this.setState(state);
  }

  confirm() {
    this.hideModal();

    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  }

  handleSubmit() {
    var validInputs = this.createUserForm.validateInputs();

    if (!validInputs) {
      return;
    }

    this.setState({disableSubmit: true, loading: true});

    CreateUserMutation.commit(
          this.props.relay.environment,
          this.createUserForm.firstName.value,
          this.createUserForm.lastName.value,
          this.createUserForm.phoneNumber.value,
          this.createUserForm.email.value,
          this.createUserForm.password.value,
          this.successfulCreation
    );
  }

  hideSuccessAlert() {
    var state = this.state;
    state.showSuccessAlert = false;
    this.setState(state);
  }

  getModalAlert() {
    if (this.state.showSuccessAlert) {
      return (<Alert bsStyle="success" onDismiss={this.hideSuccessAlert}>Success!</Alert>);
    }
  }

  hideModal() {
    var state = this.state;
    state.showModal = false;

    this.setState(state);

    this.props.onClose();
  }

  getModalBody() {
    if (this.state.successfulCreation) {
      return (
        <h3>Success</h3>
      );
    } else {
      return (
          <CreateUserForm ref={instance => {this.createUserForm = instance; }}  />
        );
    }
  }

  getModalBottomPanel() {
    if (this.state.successfulCreation) {
      return (
        <Button onClick={this.confirm}>Close</Button>
      );
    } else {
      return (
        <div>
          <Button type="submit" loading={this.state.loading} spinColor='#000' onClick={this.handleSubmit}>
            Submit
          </Button>
          <Button bsStyle="danger" onClick={this.hideModal}>
            Cancel
          </Button>
        </div>    
      );
    }
  }

  render() {
    return (
        <Modal show={this.state.showModal} dialogClassName="custom-modal">
          <Modal.Header>
            <Modal.Title id="contained-modal-title-lg">Create New Administrator</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.getModalAlert()}
            {this.getModalBody()} 
          </Modal.Body>
          <Modal.Footer>
            {this.getModalBottomPanel()}        
          </Modal.Footer>
        </Modal>
    );
  }
}

CreateUserModal.propTypes = propTypes;
