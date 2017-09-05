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
import ConfirmationModal from '../common/ConfirmationModal';

const propTypes = {
  relay: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  publisherRegistration: PropTypes.object
};

export default class CreatePublisherModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdPublisher: null
    };

    this.submit = this.submit.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.getModalTitle = this.getModalTitle.bind(this);
    this.getModalBodies = this.getModalBodies.bind(this);
    this.createConfirmationModal = this.createConfirmationModal.bind(this);
    this.success = this.success.bind(this);
    this.close = this.close.bind(this);
    this.cancel = this.close.bind(this);
  }

  validateInputs() {
    return this.createPublisherForm.validateInputs();
  }

  success(response) {
    var state = this.state;
    state.createdPublisher = response.createPublisher.publisher;
    this.setState(state);
  }

  close() {
    this.props.onClose();
  }

  cancel() {
    this.props.onCancel();
  }

  submit(success, failure) {
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
          success,
          failure
    );
  }

  getModalTitle() {
    if (this.props.publisherRegistration) {
      return "Approve Registration Request";
    } else {
      return "Create New Publisher";
    }
  }

  getModalBodies() {
    var bodies = {
      default: () => { return (<CreatePublisherForm ref={instance => {this.createPublisherForm = instance; }} publisherRegistration={this.props.publisherRegistration} />); },
      success: () => { return (<PublisherDisplay publisher={this.state.createdPublisher} />); }
    }
    
    return bodies;
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

  createConfirmationModal() {
    var bodies = this.getModalBodies();
    var functions = this.getFunctions();
    return (<ConfirmationModal relay={this.props.relay} title={this.getModalTitle()} bodies={bodies} functions={functions} />);
  }


  render() {
    return this.createConfirmationModal();
  }
}

CreatePublisherModal.propTypes = propTypes;
