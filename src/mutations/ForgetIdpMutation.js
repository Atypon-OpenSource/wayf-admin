import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation ForgetIdpMutation($input: ForgetIdpInput!) {
        forgetIdp(input: $input) {
            viewer {
                history {
                    key: idp {name},
                    idp {
                        id,
                        name,
                        type
                    },
                    lastActiveDate
                }
            }
        }
    }
`;

function commit(
    environment: Environment,
    idpId: number,
    onCompleted: func,
    onFailure: func
) {
  const variables  = {
    input: {
      idpId
    }
  }
  commitMutation(
      environment,
      {
        mutation,
        variables: variables,
        onCompleted: (response) => onCompleted(response),
        onError: (err) => onFailure(err),
      }
  );
}

export default { commit };