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
    onCompleted: func
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
        onCompleted: (response) => {
          onCompleted(response);
        },
        onError: err => console.error(err),
      }
  );
}

export default { commit };