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
  Tooltip,
  OverlayTrigger,
  Row
} from 'react-bootstrap';

import ResetUserPasswordModal from './ResetUserPasswordModal'
import DeleteUserModal from './DeleteUserModal'

class AdminUsers extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.adminUsersRowMapper = this.adminUsersRowMapper.bind(this);
    this.refetch = this.refetch.bind(this);
    this.clearDelete = this.clearDelete.bind(this);
    this.clearDeleteAndRefetch = this.clearDeleteAndRefetch.bind(this);
    this.clearReset = this.clearReset.bind(this);
    this.clearResetAndRefetch = this.clearResetAndRefetch.bind(this);
    this.renderUserAction = this.renderUserAction.bind(this);

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
        fetchAdminUsers: true
      });

      this.fetchedAdminUsers = true;
      this.props.relay.refetch(refetchVariables, null);
    }
  }

  refetch() {
    const refetchVariables = () => ({
      fetchAdminUsers: true
    });

    this.fetchedAdminUsers= true;
    this.props.relay.refetch(refetchVariables, null);
  }

  clearDelete() {
    var state = this.state;
    state.userToDelete = null;
    this.setState(state);
  }

  clearDeleteAndRefetch() {
    this.clearDelete();
    this.refetch();
  }

  clearReset() {
    var state = this.state;
    state.userToReset = null;
    this.setState(state);
  }

  clearResetAndRefetch() {
    this.clearReset();
    this.refetch();
  }

  selectUserForDeletion(user) {
    var state = this.state;
    state.userToDelete = user;
    this.setState(state);
  }

  selectUserForReset(user) {
    var state = this.state;
    state.userToReset = user;
    this.setState(state);
  }

  renderUserAction() {
    if (this.state.userToDelete) {
      return (<DeleteUserModal relay={this.props.relay} user={this.state.userToDelete} onClose={this.clearDeleteAndRefetch}  onCancel={this.clearDelete} />);
    } else if (this.state.userToReset) {
      return (<ResetUserPasswordModal relay={this.props.relay} user={this.state.userToReset} onClose={this.clearResetAndRefetch}  onCancel={this.clearReset} />);
    }
  }

  adminUsersRowMapper(adminUsers) {
    if (!adminUsers || adminUsers.length <= 0) {
      return <tr><td colSpan="6" >No administrative users</td></tr>
    }

    const resetUserPasswordTooltip = (
      <Tooltip id="tooltip">Reset user's password</Tooltip>
    );

    const deleteUserTooltip = (
      <Tooltip id="tooltip">Delete user</Tooltip>
    );

    return adminUsers.map(
        (adminUser, i) => {
          return (
            <tr key={i}>
              <td>
                {adminUser.firstName}&nbsp;{adminUser.lastName}
              </td>
              <td>
                <a href={`mailto:${adminUser.email}`}>{adminUser.email}</a>
              </td>
              <td>
                {adminUser.phoneNumber}
              </td>
              <td>
                {moment(adminUser.createdDate).format('LLL')}
              </td>
              <td>
                <OverlayTrigger delayShow={300} delayHide={150} placement="left" overlay={resetUserPasswordTooltip}>
                  <Button bsStyle="warning" onClick={() => this.selectUserForReset(adminUser)}><Glyphicon glyph="random" /></Button>
                </OverlayTrigger>
                &nbsp;
                <OverlayTrigger delayShow={300} delayHide={150} placement="right" overlay={deleteUserTooltip}>
                  <Button bsStyle="danger" onClick={() => this.selectUserForDeletion(adminUser)}><Glyphicon glyph="remove" /></Button>
                </OverlayTrigger>
              </td>
            </tr>
          )
        }
    );
  }

  render() {
    return (
      <Grid>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUserAction()}
            {this.adminUsersRowMapper(this.props.viewer.adminUsers)}
          </tbody>
        </Table>
      </Grid>);
  }
}

export default createRefetchContainer(
    AdminUsers,
    graphql.experimental`
        fragment AdminUsers_viewer on viewer 
          @argumentDefinitions(
              fetchAdminUsers: {type: "Boolean!", defaultValue: falses}
          ) {
            adminUsers @include(if: $fetchAdminUsers) {
              adminUserId: id,
              firstName,
              lastName,
              email,
              phoneNumber
              createdDate
            }
        }
    `,
    graphql.experimental`
        query AdminUsersRefetchQuery($fetchAdminUsers: Boolean!) {
            viewer {
                ...AdminUsers_viewer @arguments(fetchAdminUsers: $fetchAdminUsers)
            }
        }
    `,
);
