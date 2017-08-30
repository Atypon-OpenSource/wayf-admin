import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Nav,
  NavItem,
  Col,
  Row,
  TabContainer,
  TabContent, TabPane} from 'react-bootstrap';
import PendingRegistrations from "./PendingRegistrations";
import AdminUsers from "./AdminUsers";

const propTypes = {
  viewer: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
};

class AdminTabs extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    if (eventKey === 'pending') {
      this.pendingRegistrations.refs.component.toggleShow();
    }

    if (eventKey === 'adminUsers') {
      this.adminUsers.refs.component.toggleShow();
    }
  }

  render() {
    return (
        <TabContainer generateChildId={(eventKey, type) => `${type}-${eventKey}`} defaultActiveKey="pending">
          <Row className="clearfix">

            <Col md={12}>
              <Nav bsStyle="tabs" onSelect={this.handleSelect}>
                <NavItem eventKey="pending">Pending Registrations</NavItem>
                <NavItem eventKey="adminUsers">Admin Users</NavItem>
              </Nav>
            </Col>

            <TabContent>
              <TabPane eventKey="pending">
                <PendingRegistrations relay={this.props.relay} viewer={this.props.viewer} ref={(pendingRegistrations) => { this.pendingRegistrations = pendingRegistrations; }}/>
              </TabPane>
              <TabPane eventKey="adminUsers">
                <AdminUsers relay={this.props.relay} viewer={this.props.viewer} ref={(adminUsers) => { this.adminUsers = adminUsers; }}/>
              </TabPane>
            </TabContent>
          </Row>
        </TabContainer>
    );
  }
}

AdminTabs.propTypes = propTypes;

export default createFragmentContainer(
    AdminTabs,
    graphql.experimental`
        fragment AdminTabs_viewer on viewer {
            ...PendingRegistrations_viewer,
            ...AdminUsers_viewer
        },
    `,
);
