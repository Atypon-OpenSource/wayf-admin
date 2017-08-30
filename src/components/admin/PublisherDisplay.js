import React from 'react';

import PropTypes from 'prop-types';
import config from '../../../config';

import { createFragmentContainer, graphql } from 'react-relay';

import { 
  Grid,
  Col,
  Row
} from 'react-bootstrap';

const propTypes = {
  publisher: PropTypes.object.isRequired
};

export default class PublisherDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.buildWidgetUrl = this.buildWidgetUrl.bind(this);
  }

  buildWidgetUrl() {
    return config.wayf.host + ':' + config.wayf.port + '/' + this.props.publisher.widgetLocation;
  }

  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col><h4>Publisher Information</h4></Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>Name</b></Col>
          <Col md={6} sm={6}>{this.props.publisher.name}</Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>Code</b></Col>
          <Col md={6} sm={6}>{this.props.publisher.code}</Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>Widget Location</b></Col>
          <Col md={6} sm={6}><a href={`${this.buildWidgetUrl()}`}>{this.buildWidgetUrl()}</a></Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>API Token</b></Col>
          <Col md={6} sm={6}>{this.props.publisher.token.value}</Col>
        </Row>
        <Row>
          <Col><h4>Contact Information</h4></Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>Name</b></Col>
          <Col md={6} sm={6}>{this.props.publisher.contact.firstName}&nbsp;{this.props.publisher.contact.lastName}</Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>Email</b></Col>
          <Col md={6} sm={6}><a href={`mailto:${this.props.publisher.contact.email}`}>{this.props.publisher.contact.email}</a></Col>
        </Row>
        <Row>
          <Col md={6} sm={6}><b>Phone Number</b></Col>
          <Col md={6} sm={6}>{this.props.publisher.contact.phoneNumber}</Col>
        </Row>
      </Grid>
    );
  }
}

PublisherDisplay.propTypes = propTypes;
