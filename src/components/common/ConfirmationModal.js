import React from 'react';

import { 
  Modal,
  Alert,
  Glyphicon
} from 'react-bootstrap';

import Button from 'react-bootstrap-button-loader';

import PropTypes from 'prop-types';

export default class ConfirmationModal extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    bodies: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
    	status: null,
    	showModal: true
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getModalAlert = this.getModalAlert.bind(this);
    this.getModalBody = this.getModalBody.bind(this);
    this.getModalActions = this.getModalActions.bind(this);
  }

  show() {

  }

  handleSubmit() {
    var validInputs = true;
    if (this.props.functions.validateInputs) {
      validInputs = this.props.functions.validateInputs();
    }

    this.props.functions.submit(this.handleSuccess, this.handleFailure);

    var state = this.state;
    state.status == 'LOADING';
    this.setState(state);
  }

  handleSuccess(response) {
    if (this.props.functions.success) {
      this.props.functions.success(response);
    }

    var state = this.state;
    state.status = 'SUCCESS';
    this.setState(state);
  }

  handleFailure(response) {
    var state = this.state;
    state.status = 'FAILURE';
    this.setState(state);

    if (this.props.functions.failure) {
      this.props.functions.failure(response);
    }
  }

  handleCancel() {
    var state = this.state;
    state.showModal = false;
    this.setState(state);

    if (this.props.functions.cancel) {
      this.props.functions.cancel();
    }
  }

  handleClose() {
    var state = this.state;
    state.status = 'CLOSED';
    state.showModal = false;
    this.setState(state);

    if (this.props.functions.close) {
      this.props.functions.close();
    }
  }

  getModalAlert() {
    if (this.state.status == 'SUCCESS') {
      return (<Alert bsStyle="success"><Glyphicon glyph="ok" />&nbsp;Success!</Alert>);
    } else if (this.state.status == 'FAILURE') {
      return (<Alert bsStyle="error"><Glyphicon glyph="remove" />&nbsp;Failure!</Alert>);
    }
  }

  getModalBody() {
    if (this.state.status == 'SUCCESS') {
      return this.props.bodies.success();
    } else if (this.state.status == 'FAILURE') {
      return this.props.bodies.failure();
    } else if (this.state.status == 'CLOSED') {
      return <p / >;
    } else {
      return this.props.bodies.default();
    }
  }

  getModalActions() {
    if (this.state.status == 'SUCCESS') {
      return (<Button onClick={this.handleClose}>Close</Button>);
    } else {
      return (
        <div>
          <Button loading={this.state.loading} spinColor='#000' onClick={this.handleSubmit}>
            Confirm
          </Button>
          <Button bsStyle='danger' onClick={this.handleCancel}>
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
	        <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
	      </Modal.Header>
	      <Modal.Body>
          {this.getModalAlert()}
	        {this.getModalBody()}
	      </Modal.Body>
	      <Modal.Footer>
          {this.getModalActions()}         
	      </Modal.Footer>
	    </Modal>
    );
  }
}
