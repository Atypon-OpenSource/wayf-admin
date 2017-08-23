import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation CreateUserMutation($input: CreateUserInput!) {
        createUser(input: $input) {
            user {
                userId: id
            }
        }
    }
`;

function commit(
    environment: Environment,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    password: string,
    onComplete: func
) {
  const variables  = {
    input: {
      firstName,
      lastName,
      phoneNumber,
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