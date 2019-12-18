import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut {
      message
    }
  }
`;

const Signout = () => <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signout, { loading, error }) => (
        <span onClick={signout} role="button">
        LogOut
        </span>
    )}
  </Mutation>;

export { SIGN_OUT_MUTATION };
export default Signout;
