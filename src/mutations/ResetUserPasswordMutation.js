import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation ResetUserPasswordMutation($input: ResetUserPasswordInput!) {
        resetUserPassword(input: $input) {
            viewer {
                me {
                  adminId: id
                }
            }
        }
    }
`;

function commit(
    environment: Environment,
    userId: number,
    password: string,
    onCompleted: func,
    onFailure: func
) {
  const variables  = {
    input: {
      userId,
      password
    }
  }
  commitMutation(
      environment,
      {
        mutation,
        variables: variables,
        onCompleted: (response, errors) => {
            if (errors && errors.length > 0) {
              onFailure(errors);
            } else {
              onCompleted(response);
            }
        },
        onError: (err) => onFailure(err),
      }
  );
}

export default { commit };