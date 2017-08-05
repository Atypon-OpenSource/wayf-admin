import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation CreatePublisherMutation($input: CreatePublisherInput!) {
        createPublisher(input: $input) {
            publisher {
              name,
              code,
              widgetLocation,
              token,
              status
              contact {
                firstName,
                lastName,
                email,
                phoneNumber
              }
            }
        }
    }
`;

function commit(
    environment: Environment,
    publisherName: string,
    publisherCode: string,
    registrationId: int,
    contactFirstName: string,
    contactLastName: string,
    contactPhoneNumber: string,
    contactEmail: string,
    onComplete: func
) {
  const variables  = {
    input: {
      publisherName,
      publisherCode,
      registrationId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail
    }
  }

  commitMutation(
      environment,
      {
        mutation,
        variables: variables,
        onCompleted: (response) => {
          onComplete(response);
        },
        onError: err => console.error(err),
      }
  );
}

export default { commit };