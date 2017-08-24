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
import CreatePublisherMutation from '../../mutations/CreatePublisherMutation';
import CreatePublisherForm from './CreatePublisherForm';
import PublisherDisplay from './PublisherDisplay';

const propTypes = {
  relay: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  publisherRegistration: PropTypes.object
};

export default class CreatePublisherModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        showModal: true,
        loading: false,
        showSuccessAlert: false,
        successfulCreation: false,
        publisherNameValidationState: null,
        publisherCodeValidationState: null,
        contactFirstNameValidationState: null,
        contactLastNameValidationState: null,
        contactPhoneValidationState: null,
        contactEmailValidationState: null,
    };

    this.hideSuccessAlert = this.hideSuccessAlert.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.successfulCreation = this.successfulCreation.bind(this);
    this.getModalTitle = this.getModalTitle.bind(this);
    this.getModalBody = this.getModalBody.bind(this);
    this.getModalBottomPanel = this.getModalBottomPanel.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  successfulCreation(mutationResponse) {
    var state = this.state;
    state.loading = false;
    state.successfulCreation = true;
    state.createdPublisher = mutationResponse.createPublisher.publisher;
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
    var validInputs = this.createPublisherForm.validateInputs();

    if (!validInputs) {
      return;
    }

    this.setState({disableSubmit: true, loading: true});

    var publisherRegistrationId = 
      this.props.publisherRegistration? 
        this.props.publisherRegistration.publisherRegistrationId : null;

    CreatePublisherMutation.commit(
          this.props.relay.environment,
          this.createPublisherForm.publisherName.value,
          this.createPublisherForm.publisherCode.value,
          publisherRegistrationId,
          this.createPublisherForm.contactFirstName.value,
          this.createPublisherForm.contactLastName.value,
          this.createPublisherForm.contactPhoneNumber.value,
          this.createPublisherForm.contactEmail.value,
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

  getModalTitle() {
    if (this.props.publisherRegistration) {
      return "Approve Registration Request";
    } else {
      return "Create New Publisher";
    }
  }

  getModalBody() {
    if (this.state.successfulCreation) {
      return (
        <PublisherDisplay publisher={this.state.createdPublisher} />
      );
    } else {
      return (
          <CreatePublisherForm ref={instance => {this.createPublisherForm = instance; }} publisherRegistration={this.props.publisherRegistration} />
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
            <Modal.Title id="contained-modal-title-lg">{this.getModalTitle()}</Modal.Title>
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

CreatePublisherModal.propTypes = propTypes;
