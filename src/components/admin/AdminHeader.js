import React from 'react';

import { 
  createFragmentContainer, 
  graphql 
} from 'react-relay';

import { 
  Grid,
  Row,
  Col,
  DropdownButton,
  MenuItem,
  Glyphicon
} from 'react-bootstrap';

import PropTypes from 'prop-types';

const propTypes = {
  viewer: PropTypes.object.isRequired,
  createPublisher: PropTypes.func.isRequired,
  createAdmin: PropTypes.func.isRequired
};

class AdminHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
	  <Grid fluid={true}>
		<Row>
		  <Col md={11} sm={11}><h1>WAYF Administration</h1></Col>
		  <Col md={1} sm={1}>
        <Grid>
          <Row>
            <Col>
              <Glyphicon glyph="user" />&nbsp;{this.props.viewer.me.firstName}&nbsp;{this.props.viewer.me.lastName}
            </Col>
          </Row>
          <Row>
            <Col>
      		  	<DropdownButton  title="Available Actions" id="bg-nested-dropdown">
      			    <MenuItem eventKey="createPublisher" onClick={this.props.createPublisher}><Glyphicon glyph="plus" />&nbsp;Create Publisher</MenuItem>
      		      <MenuItem eventKey="createAdmin" onClick={this.props.createAdmin}><Glyphicon glyph="plus" />&nbsp;Create Administrator</MenuItem>
              </DropdownButton>
            </Col>
          </Row>
        </Grid>
		  </Col>
		</Row>
	  </Grid>
    );
  }
}

AdminHeader.propTypes = propTypes;

export default createFragmentContainer(
  AdminHeader,
  graphql`
    fragment AdminHeader_viewer on viewer {
      me {
        firstName,
        lastName
      }
    }
  `
);