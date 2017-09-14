import React from 'react';

import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';

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


class AdminPublishers extends React.Component {
    static propTypes = {
        viewer: PropTypes.object.isRequired,
        relay: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.adminPublishersRowMapper = this.adminPublishersRowMapper.bind(this);
        this.refetch = this.refetch.bind(this);
        this.clearDelete = this.clearDelete.bind(this);
        this.clearDeleteAndRefetch = this.clearDeleteAndRefetch.bind(this);
        this.clearReset = this.clearReset.bind(this);
        this.clearResetAndRefetch = this.clearResetAndRefetch.bind(this);

        this.state = {
            publisherRegistrationToApprove: null,
            publisherRegistrationToDeny: null
        };

    }



    toggleShow() {
        if (!this.fetchedHistory) {
            const refetchVariables = () => ({
                fetchAdminPublishers: true
            });

            this.fetchedAdminPublishers = true;
            this.props.relay.refetch(refetchVariables, null);
        }
    }

    refetch() {
        const refetchVariables = () => ({
            fetchAdminPublishers: true
        });

        this.fetchedAdminPublishers= true;
        this.props.relay.refetch(refetchVariables, null);
    }

    clearDelete() {
        var state = this.state;
        state.publisherToDelete = null;
        this.setState(state);
    }

    clearDeleteAndRefetch() {
        this.clearDelete();
        this.refetch();
    }

    clearReset() {
        var state = this.state;
        state.publisherToReset = null;
        this.setState(state);
    }

    clearResetAndRefetch() {
        this.clearReset();
        this.refetch();
    }


    adminPublishersRowMapper(adminPublishers) {
        if (!adminPublishers || adminPublishers.length <= 0) {
            return <tr><td colSpan="6" >No administrative publishers</td></tr>
        }


        return adminPublishers.map(
            (adminPublisher, i) => {
                return (
                    <tr key={i}>
                        <td>
                            {adminPublisher.id}
                        </td>
                        <td>
                            {adminPublisher.code}
                        </td>
                        <td>
                            {adminPublisher.name}
                        </td>
                        <td>
                            {adminPublisher.widgetLocation}
                        </td>
                        <td>
                            {adminPublisher.token.value}
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
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Widget Location</th>
                        <th>Token</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.adminPublishersRowMapper(this.props.viewer.adminPublishers)}
                    </tbody>
                </Table>
            </Grid>);
    }
}

export default createRefetchContainer(
    AdminPublishers,
    graphql.experimental`
        fragment AdminPublishers_viewer on viewer 
          @argumentDefinitions(
              fetchAdminPublishers: {type: "Boolean!", defaultValue: false}
          ) {
            adminPublishers @include(if: $fetchAdminPublishers) {
              id,
              code,
              name,
              widgetLocation,
              token {type, value, validUntil}
              }
        }
        
        
    `,
    graphql.experimental`
        query AdminPublishersRefetchQuery($fetchAdminPublishers: Boolean!) {
            viewer {
                ...AdminPublishers_viewer @arguments(fetchAdminPublishers: $fetchAdminPublishers)
            }
        }
    `,
);
