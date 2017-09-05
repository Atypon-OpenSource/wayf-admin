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
    onComplete: func,
    onError: func
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
        onCompleted: (response, errors) => {
            if (errors && errors.length > 0) {
              onError(errors);
            } else {
              onComplete(response);
            }
        },
        onError: (err) => onError(err),
      }
  );
}

export default { commit };