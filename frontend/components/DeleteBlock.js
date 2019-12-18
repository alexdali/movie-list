import React, { Component } from 'react';
import { graphql } from '@apollo/react-hoc';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Segment, Button, Form, Divider,
} from 'semantic-ui-react';
import Router from 'next/router';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const RowDiv = styled.div`
  div.field.title-view > textarea {
    width: 100%;
    max-height: 100%;
    font-size: 2.5em;
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    resize: none;
  }
  .post-meta {
    display: flexbox;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1em 2em 0;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  }
  .ui.form > div.field.post-content > textarea {
    font-size: 1.5em;
    border: none;
    max-height: 100%;
    resize: none;
  }
`;

// const UPDATE_PASSWORD_MUTATION = gql`
//   mutation UPDATE_PASSWORD_MUTATION(
//     $userId: String!
//     $password: String!
//   ) {
//     updatePassword(
//       userId: $userId
//       password: $password
//       ) {
//     }
//   }
// `;


const withDeleteUserMutate = graphql(
  gql`
  mutation DELETE_USER_MUTATION(
    $userId: String!
    $password: String!
  ) {
    deleteUser(
      userId: $userId
      password: $password
      ) {
        message
      }
    }
  `,
  {
    options: (props) => ({
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY,
        },
      ],
      onCompleted: (response) => {
        if (typeof response.deleteUser !== 'undefined' && response.deleteUser.message === 'Success') {
          Router.push({
            pathname: '/',
          });
        }
      },
    }),
  },
);


class DeleteBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
      },
      readOnly: true,
      showDelete: false,
      successResponse: false,
    };
  }

  enableDelete = (val) => {
    const { user } = this.props;
    if (val) {
      this.setState({
        user: { ...user, password: '' },
        showDelete: true,
        readOnly: false,
      });
    } else {
      this.setState({
        showDelete: false,
        readOnly: true,
        user: this.props.user,
      });
    }
  };

  handleChange = (e, data) => {
    const { name, type, value } = e.target;
    const val = value;
    const nam = name;

    const { user } = this.state;
    user[nam] = val;
    this.setState({ user });
  };

  render() {
    const { mutate, result } = this.props;
    const {
      user,
      successResponse,
      readOnly,
      showDelete,
    } = this.state;
    return (
          <RowDiv>
            <Segment>

                {!showDelete ? (
                  <Button.Group basic attached='bottom'>
                    <Button
                      icon
                      size="large"
                      onClick={() => this.enableDelete(true)}
                    >
                      Удалить аккаунт
                    </Button>
                  </Button.Group>
                ) : (
                  <Segment attached='bottom'>

                    <Form.Input
                      label='Введите пароль'
                      fluid
                      type="password"
                      name="password"
                      placeholder="пароль"
                      readOnly={readOnly}
                      disabled={result.loading}
                      value={user.password}
                      onChange={this.handleChange}
                      required
                    />

                    <Divider horizontal></Divider>

                      <Button
                        icon size="large"
                        onClick={() => {
                          mutate({
                            variables: {
                              userId: user.id,
                              password: user.password,
                            },
                          });
                        }
                                }
                      >
                        Удалить аккаунт
                      </Button>
                      <Button onClick={() => this.enableDelete(false)}>Отмена</Button>

                  </Segment>
                )}
                {/* {successResponse
                  && <Message positive>
                    <Message.Header>Успешно!</Message.Header>
                    <p>Аккаунт {user.name} удален</p>
                  </Message>
                } */}

            </Segment>
          </RowDiv>
    );
  }
}

export default withDeleteUserMutate(DeleteBlock);
