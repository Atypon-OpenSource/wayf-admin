import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation DenyPublisherRegistrationMutation($input: DenyPublisherRegistrationInput!) {
        denyPublisherRegistration(input: $input) {
              publisherRegistration {
                id,
                status
              }
        }
    }
`;

function getConfigs(viewerId) {
  return [{
    type: 'RANGE_ADD',
    parentName: 'viewer',
    parentID: viewerId,
    connectionName: 'features',
    edgeName: 'featureEdge',
    rangeBehaviors: {
      '': 'append',
    },
  }];
}



function commit(
    environment: Environment,
    publisherRegistrationId: number,
    onComplete: func,
    onFailure: func
) {
  const variables  = {
    input: {
      publisherRegistrationId,
    }
  }

  commitMutation(
      environment,
      {
        mutation,
        variables: variables,
        onCompleted: (response) => onComplete(),
        onError: (err) => onFailure(err),
      }
  );
}


export default { commit };