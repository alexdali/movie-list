import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { Form, FormDiv } from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import { ALL_USERS_QUERY } from './LeftSideBar';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

// const CURRENT_USER_MUTATION = gql`
//   mutation CURRENT_USER_MUTATION($id: String!, $name: String!, $email: String!){
//     currentUser(id: $id, name: $name, email: $email) @client
//   }
// `;

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const RowDiv = styled.div`
position: fixed;
display: block;
overflow: hidden;
    margin-left: 70%;
    margin-top: 45px;
    background: white;
    padding: 20px;
    width: 300px;
    height: 100vh;
    z-index: 100;
`;


/* eslint-disable */
const Composed = adopt({
  currentUser: ({render}) => <Query query={CURRENT_USER_QUERY}>{render}</Query>,
  signupMutate: ({render}) => <Mutation mutation={SIGNUP_MUTATION}>{render}</Mutation>,
  signinMutate: ({render}) => <Mutation mutation={SIGNIN_MUTATION}>{render}</Mutation>,
  // currentUserMutate: ({render}) => <Mutation mutation={CURRENT_USER_MUTATION}>{render}</Mutation>,
});
/* eslint-enable */

class Login extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    loading: false,
    signup: false,
    error: '',
  };

  showSignUp = () => {
    this.setState({
      name: '',
      email: '',
      password: '',
      loading: false,
      signup: true,
      error: '',
    });
  };

  createAccount = async (e, signupMutate) => {
    e.preventDefault();
    const {
      name, email, password, loading,
    } = this.state;
    await this.setState({
      loading: true,
    },
      // () => {
      //   // this.props.handleRes(res);
      //   this.props.closeLoginForm();
      // }
    );

    // TO-DO spiner for await
    const res = await signupMutate({
      variables: { name, email, password },
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY,
        },
        {
          query: ALL_USERS_QUERY,
        },
      ],
    }).catch((error) => {
      const errMessage = error.message.replace('GraphQL error: ', '');
      this.setState({
        name: '',
        email: '',
        password: '',
        signup: false,
        error: errMessage,
      });
    });

    if (res) {
      this.setState({
        name: '',
        email: '',
        password: '',
        signup: false,
        loading: false,
        error: '',
      },
      () => {
        // this.props.handleRes(res);
        this.props.closeLoginForm();
      });
    }
  };

  /* disable eslint(no-underscore-dangle) */
  signInHandle = async (e, signinMutate) => {
    e.preventDefault();
    const { email, password } = this.state;
    const res = await signinMutate({
      variables: { email, password },
      // update: {(cache, { data: { me } }) => {
      //   const {me} = cache.readQuery({ query: CURRENT_USER_QUERY });
      //   console.log('signinMutate update me: ', me);
      //   cache.writeQuery({
      //     query: CURRENT_USER_QUERY,
      //     data: { me: me },
      //   });
      // }},
      // update: this.update,
      refetchQueries: [{
        query: CURRENT_USER_QUERY,
      }],
    }).catch((error) => {
      const errMessage = error.message.replace('GraphQL error: ', '');
      this.setState({
        name: '',
        email: '',
        password: '',
        signup: false,
        error: errMessage,
      });
    });

    if (res) {
      this.setState({
        name: '',
        email: '',
        password: '',
        signup: false,
        error: '',
      },
      // async () => {
      //   console.log('Signin signInHandle this.state: ', this.state);
      //   // this.props.setCurrentUser(res.data.signIn);
      //   this.props.handleRes(res);
      //   const currentUser = res.data.signIn;
      //   // currentUser.__typename = 'currentUser';
      //   console.log('Signin currentUserMutate currentUser: ', currentUser);
      //   await currentUserMutate({
      //     variables: { id: currentUser.id, name: currentUser.name, email: currentUser.email },
      //   }).then(
      //     // this.props.setCurrentUser()
      //   ).catch((error) => {
      //     console.log('Signin currentUserMutate Error: ', error.message);
      //   });
      //   // console.log('Signin currentUserMutate resCache: ', resCache);
        //    }
      );
      // this.props.handleRes(res);
      this.props.closeLoginForm();
    }
  };
  /* enable eslint(no-underscore-dangle) */

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  closeForm=() => {
    this.props.closeLoginForm();
  }

  render() {
    const { signup, error, loading } = this.state;
    return (
      <Composed>
        {({
          currentUser, signinMutate, signupMutate,
        }) => (
          <RowDiv className="login-background">
            <div className="blur">
              <FormDiv>
                <Form>
                <Icon className="close-icon" name='close' onClick={this.closeForm} />
                  {error && <ErrorMessage error={error} />}
                  {/* <fieldset disabled={loading} aria-busy={loading}> */}
                  <fieldset>
                    {signup
                      && <div className="formItem">
                          <label htmlFor="name">
                            <div className="formItem-control">
                              <span className="input-wrapper">
                                <span className="input-prefix">
                                  <Icon name="user outline" />
                                </span>
                                <input
                                  type="text"
                                  name="name"
                                  placeholder="имя"
                                  disabled={loading}
                                  readOnly={loading}
                                  value={this.state.name}
                                  onChange={this.saveToState}
                                />
                              </span>
                            </div>
                          </label>
                        </div>
                    }
                    <div className="formItem">
                      <label htmlFor="email">
                        <div className="formItem-control">
                          <span className="input-wrapper">
                            <span className="input-prefix">
                              <Icon name="mail" />
                            </span>
                            <input
                              type="email"
                              name="email"
                              placeholder="email"
                              disabled={loading}
                              readOnly={loading}
                              value={this.state.email}
                              onChange={this.saveToState}
                            />
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="formItem">
                      <label htmlFor="password">
                        <div className="formItem-control">
                          <span className="input-wrapper">
                            <span className="input-prefix">
                              <Icon name="lock" />
                            </span>
                            <input
                              type="password"
                              name="password"
                              placeholder="пароль"
                              disabled={loading}
                              readOnly={loading}
                              value={this.state.password}
                              onChange={this.saveToState}
                            />
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="formItem">
                      <div className="formItem-control">
                        <span className="form-item-children">
                          {
                            signup
                              ? <Button compact fluid
                                  onClick={(e) => this.createAccount(e, signupMutate, currentUser)}
                                  positive
                                  loading={loading}
                                  >
                                  <span>Создать аккаунт</span>
                                </Button>
                              : <Button.Group compact fluid>
                                  <Button
                                    onClick={(e) => this.signInHandle(e, signinMutate)}
                                    loading={loading}
                                    positive
                                  >
                                    <span>Войти</span>
                                  </Button>
                                  <Button.Or text=' ' />
                                  <Button
                                    onClick={() => this.showSignUp()}
                                  >
                                    <span>Зарегистрироваться</span>
                                  </Button>
                                </Button.Group>

                          }
                        </span>
                      </div>
                    </div>
                  </fieldset>

                </Form>
              </FormDiv>
            </div>
          </RowDiv>
        )
        }
      </Composed>
    );
  }
}

export default Login;
