import React from 'react';

import PropTypes from 'prop-types';

import { 
  createFragmentContainer, 
  graphql 
} from 'react-relay';

import cookie from 'react-cookies'
import Login from './Login';
import AdminHeader from './AdminHeader';
import AdminTabs from './AdminTabs';
import { 
  Grid,
  Col,
  Button
} from 'react-bootstrap';

import CreatePublisherModal from './CreatePublisherModal';

class AdminApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreatePublisherModal: false
    };

    this.showCreatePublisher = this.showCreatePublisher.bind(this);
    this.hideCreatePublisherModal = this.hideCreatePublisherModal.bind(this);
    this.renderAdminAction = this.renderAdminAction.bind(this);
    this.authorizationCheck = this.authorizationCheck.bind(this);
  }

  showCreatePublisher() {
    var state = this.state;
    state.showCreatePublisherModal = true;
    this.setState(state);
  }

  hideCreatePublisherModal() {
    var state = this.state;
    state.showCreatePublisherModal = false;
    this.setState(state);
  }

  renderAdminAction() {
    if (this.state.showCreatePublisherModal) {
      return <CreatePublisherModal relay={this.props.relay} onClose={this.hideCreatePublisherModal} />
    }
  }

  authorizationCheck() {
    if (this.props.viewer.me.adminId) {
      return (
          <div data-framework="relay">
            <Grid>
              {this.renderAdminAction()}
              <AdminHeader createPublisher={this.showCreatePublisher} />
              <AdminTabs relay={this.props.relay} viewer={this.props.viewer}/>
            </Grid>
          </div>
        );
    } else {
      return (<Login relay={this.props.relay} />);
    }
  }

  render() {
    return this.authorizationCheck();
  }
}

export default createFragmentContainer(
  AdminApp,
  graphql`
    fragment AdminApp_viewer on viewer {
      me {
        adminId: id,
        firstName,
        lastName
      }
      ...AdminTabs_viewer
    }
  `
);