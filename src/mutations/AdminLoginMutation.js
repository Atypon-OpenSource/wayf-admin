import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation AdminLoginMutation($input: AdminLoginInput!) {
        adminLogin(input: $input) {
            token {
                type,
                value
            }
        }
    }
`;

function commit(
    environment: Environment,
    email: string,
    password: string,
    onComplete: func
) {
  const variables  = {
    input: {
      email,
      password
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