import React from 'react';

import { 
  Modal,
  Alert
} from 'react-bootstrap';

import Button from 'react-bootstrap-button-loader';

import PropTypes from 'prop-types';
import ForgetIdpMutation from '../../mutations/ForgetIdpMutation';
import ConfirmationModal from '../common/ConfirmationModal';

export default class ForgetIdpModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    relay: PropTypes.object.isRequired,
    identityProvider: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.getModalBodies = this.getModalBodies.bind(this);
    this.createConfirmationModal = this.createConfirmationModal.bind(this);
    this.close = this.close.bind(this);
    this.cancel = this.close.bind(this);
  }

  submit(success, failure) {
    ForgetIdpMutation.commit(
        this.props.relay.environment,
        this.props.identityProvider.idpId,
        success
    );
  }

  close() {
    this.props.onClose();
  }

  cancel() {
    this.props.onCancel();
  }

  getModalBodies() {
    var bodies = {
      default: () => { return (<p>Are you sure you want to remove <b>{this.props.identityProvider.name}</b> from your login suggestions?</p>); },
      success: () => { return (<p>Successfully removed <b>{this.props.identityProvider.name}</b> from your login suggestions.</p>); }
    }

    return bodies;
  }

  getFunctions() {
    var functions = {
      submit: this.submit,
      close: this.close,
      cancel: this.cancel
    }

    return functions;
  }

  createConfirmationModal() {
    var bodies = this.getModalBodies();
    var functions = this.getFunctions();
    return (<ConfirmationModal relay={this.props.relay} title="Forget Identity Provider" bodies={bodies} functions={functions} />);
  }


  render() {
    return this.createConfirmationModal();
  }
}
