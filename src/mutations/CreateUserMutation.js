import { graphql, commitMutation, Environment } from 'react-relay/compat';

const mutation = graphql`
    mutation CreateUserMutation($input: CreateUserInput!) {
        createUser(input: $input) {
            user {
                userId: id,
                firstName,
                lastName
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
    onComplete: func,
    onFailure: func
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
        onCompleted: (response, errors) => {
            if (errors && errors.length > 0) {
              onFailure(errors);
            } else {
              onComplete(response);
            }
        },
        onError: err => onFailure(err),
      }
  );
}

export default { commit };