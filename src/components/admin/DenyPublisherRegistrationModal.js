import React from 'react';

import { 
  Modal,
  Button
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import DenyPublisherRegistrationMutation from'../../mutations/DenyPublisherRegistrationMutation'
import ConfirmationModal from '../common/ConfirmationModal';

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  onClose:  PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
  publisherRegistration: PropTypes.object.isRequired
};

export default class DenyPublisherRegistrationModal extends React.Component {

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.close = this.close.bind(this);
    this.cancel = this.cancel.bind(this);
    this.getModalBodies = this.getModalBodies.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.createConfirmationModal = this.createConfirmationModal.bind(this);
  }

  submit(success, failure) {
    console.log('submitting');
  	DenyPublisherRegistrationMutation.commit(
        this.props.relay.environment,
        this.props.publisherRegistration.publisherRegistrationId, 
        success
    );
  }

  cancel() {
  	this.props.onCancel();
  }

  close() {
    this.props.onClose();
  }

  getModalBodies() {
    var bodies = {
      default: () => { return (<p>Are you sure you want to reject the request for <b>{this.props.publisherRegistration.publisherName}</b>?</p>); },
      success: () => { return (<p>Successfully rejected <b>{this.props.publisherRegistration.publisherName}</b>'s request.</p>); }
    }

    return bodies;
  }

  getFunctions() {
    var functions = {
      submit: this.submit,
      close: this.close,
      cancel: this.close
    }

    return functions;
  }

  createConfirmationModal() {
    var bodies = this.getModalBodies();
    var functions = this.getFunctions();
    return (<ConfirmationModal relay={this.props.relay} title="Deny Registration Request" bodies={bodies} functions={functions} />);
  }

  render() {
    return this.createConfirmationModal();
  }
}

DenyPublisherRegistrationModal.propTypes = propTypes;
