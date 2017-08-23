import React from 'react';

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
  createPublisher: PropTypes.func.isRequired,
  createAdmin: PropTypes.func.isRequired
};

export default class AdminHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
	  <Grid fluid={true}>
		<Row>
		  <Col md={6} sm={6}><h1>WAYF Administration</h1></Col>
		  <Col md={5} sm={5} />
		  <Col md={1} sm={1}>
		  	<DropdownButton  title="Available Actions" id="bg-nested-dropdown">
			    <MenuItem eventKey="createPublisher" onClick={this.props.createPublisher}><Glyphicon glyph="plus" />&nbsp;Create Publisher</MenuItem>
		      <MenuItem eventKey="createAdmin" onClick={this.props.createAdmin}><Glyphicon glyph="plus" />&nbsp;Create Administrator</MenuItem>
        </DropdownButton>
		  </Col>
		</Row>
	  </Grid>
    );
  }
}

AdminHeader.propTypes = propTypes;