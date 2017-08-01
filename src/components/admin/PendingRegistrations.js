import React from 'react';

import PropTypes from 'prop-types';
import moment from 'moment';
import { createRefetchContainer, graphql } from 'react-relay';
import CreatePublisherModal from './CreatePublisherModal'
import DenyPublisherRegistrationModal from './DenyPublisherRegistrationModal'
import {
  Grid,
  Table,
  Col,
  Button,
  Glyphicon,
  Row} from 'react-bootstrap';


class PendingRegistrations extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.pendingRegistrationsRowMapper = this.pendingRegistrationsRowMapper.bind(this);
    this.approveClick = this.approveClick.bind(this);
    this.cancelApproval = this.cancelApproval.bind(this);
    this.denyClick = this.denyClick.bind(this);
    this.clearDenyRequest = this.clearDenyRequest.bind(this);

    this.state = {
      publisherRegistrationToApprove: null,
      publisherRegistrationToDeny: null
    };

  }

  subscribeToForget() {
    this.fetchedHistory = false;
    this.toggleShow();
  }

  toggleShow() {
    if (!this.fetchedHistory) {
      const refetchVariables = () => ({
        fetchPendingRegistrations: true
      });

      this.fetchedHistory = true;
      this.props.relay.refetch(refetchVariables, null);
    }
  }

  approveClick(publisherRegistration) {
    var state = this.state;
    state.publisherRegistrationToApprove = publisherRegistration;

    this.setState(state);
  }

  denyClick(publisherRegistration) {
    var state = this.state;
    state.publisherRegistrationToDeny = publisherRegistration;

    this.setState(state);
  }

  cancelApproval() {
    var state = this.state;
    state.publisherRegistrationToApprove = null;

    this.setState(state);
  }

  clearDenyRequest() {
    console.log('clearing');
    var state = this.state;
    state.publisherRegistrationToDeny = null;

    this.setState(state);
    const refetchVariables = () => ({
        fetchPendingRegistrations: true
      });

    this.props.relay.refetch(refetchVariables, null);

  }

  pendingRegistrationsRowMapper(pendingPublisherRegistrations) {
    if (!pendingPublisherRegistrations) {
      return <p>No pending registrations</p>;
    }

    return pendingPublisherRegistrations.map(
        (publisherRegistration, i) => {
          return (
            <tr>
              <td>
                {publisherRegistration.publisherName}
              </td>
              <td>
                {publisherRegistration.contact.firstName}&nbsp;{publisherRegistration.contact.lastName}
              </td>
              <td>
                <a href={`mailto:${publisherRegistration.contact.email}`}>{publisherRegistration.contact.email}</a>
              </td>
              <td>
                {publisherRegistration.contact.phoneNumber}
              </td>
              <td>
                {moment(publisherRegistration.applicationDate).format('LLL')}
              </td>
              <td>
                <Button bsStyle="success" value={publisherRegistration} onClick={() => this.approveClick(publisherRegistration)} ><Glyphicon glyph="ok" /></Button>
                &nbsp;
                <Button bsStyle="danger" onClick={() => this.denyClick(publisherRegistration)} ><Glyphicon glyph="remove" /></Button>
              </td>
            </tr>
          )
        }
    );
  }

  render() {
    var actionModal;
    if (this.state.publisherRegistrationToApprove) {
      actionModal = <CreatePublisherModal onCancel={this.cancelApproval} publisherRegistration={this.state.publisherRegistrationToApprove}/>;
    } else if (this.state.publisherRegistrationToDeny) {
      actionModal = <DenyPublisherRegistrationModal relay={this.props.relay} onCancel={this.clearDenyRequest} onDeny={this.clearDenyRequest} publisherRegistration={this.state.publisherRegistrationToDeny}/>;
    } else {
      actionModal = <div></div>;
    }



    return (
      <Grid>
        {actionModal}
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Publisher Name</th>
              <th>Contact Name</th>
              <th>Contact Email</th>
              <th>Contact Phone Number</th>
              <th>Application Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.pendingRegistrationsRowMapper(this.props.viewer.pendingPublisherRegistrations)}
          </tbody>
        </Table>
      </Grid>);
  }
}

export default createRefetchContainer(
    PendingRegistrations,
    graphql.experimental`
        fragment PendingRegistrations_viewer on viewer 
          @argumentDefinitions(
              fetchPendingRegistrations: {type: "Boolean!", defaultValue: true}
          ) {
            pendingPublisherRegistrations @include(if: $fetchPendingRegistrations) {
              publisherRegistrationId: id,
              publisherName,
              status,
              contact {
                firstName,
                lastName,
                email,
                phoneNumber
              },
              applicationDate
            }
        }
    `,
    graphql.experimental`
        query PendingRegistrationsRefetchQuery($fetchPendingRegistrations: Boolean!) {
            viewer {
                ...PendingRegistrations_viewer @arguments(fetchPendingRegistrations: $fetchPendingRegistrations)
            }
        }
    `,
);
