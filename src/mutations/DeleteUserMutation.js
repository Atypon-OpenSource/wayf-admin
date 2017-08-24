import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation DeleteUserMutation($input: DeleteUserInput!) {
        deleteUser(input: $input) {
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
    onCompleted: func
) {
  const variables  = {
    input: {
      userId
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