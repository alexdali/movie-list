import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Segment, Form, Button, Message,
} from 'semantic-ui-react';
import styled from 'styled-components';
import { ALL_LISTS_QUERY } from './RatingList';
import { LISTS_BY_USER_QUERY } from './ListsByUser';
import { CURRENT_USER_QUERY } from './User';

const CREATE_LIST_MUTATION = gql`
  mutation CREATE_LIST_MUTATION(
    $userId: String!
    $title: String!
    $description: String!
  ) {
    createList(
      userId: $userId
      title: $title
      description: $description
      ) {
        id
        title
        userId
        description
        numberOfItems
        userAverageRating
        createdDate
    }
  }
`;

const RowDiv = styled.div`
  .ui.form > div.field.post-description > textarea {
    resize: none;
  }
`;


class ListCreateForm extends Component {
  // static propTypes = {
  //   listItem: PropTypes.shape({
  //     id: PropTypes.string,
  //     userId: PropTypes.string,
  //     title: PropTypes.string,
  //     description: PropTypes.string,
  //     createdDate: PropTypes.string,
  //   }).isRequired,
  // };

  state = {
    listItem: {
      userId: this.props.id,
      title: '',
      description: '',
    },
    readOnly: false,
    showEdit: '',
  };


  handleChange = (e, data) => {
    const { name, type, value } = e.target;
    const val = value;
    const nam = name;

    const { listItem } = this.state;
    listItem[nam] = val;
    this.setState({ listItem });
  };


    createListItem = async (e, createList) => {
      e.preventDefault();
      const { userId, title, description } = this.state.listItem;
      const res = await createList({
        variables: {
          userId, title, description,
        },
        refetchQueries: [{
          query: LISTS_BY_USER_QUERY,
          variables: { id: this.props.id },
        },
        {
          query: ALL_LISTS_QUERY,
        },
        {
          query: CURRENT_USER_QUERY,
        }],
        // update: (cache, payload, userId) => this.update(cache, payload, userId),
      });
      // const { id } = res.data.createList;
      this.setState({
        listItem: {
          userId: '',
          title: '',
          description: '',
          createdDate: '',
        },
        showEdit: '',
        readOnly: true,
      });
    };

    render() {
      const {
        listItem,
        readOnly,
      } = this.state;
      return (

      <Mutation
        mutation={CREATE_LIST_MUTATION}
        variables={{
          listItem,
        }}
        refetchQueries={() => [{
          query: LISTS_BY_USER_QUERY,
          variables: { id: this.props.id },
        },
        {
          query: ALL_LISTS_QUERY,
        },
        ]
        }
      >
        {(createList, { loading, error }) => {
          if (error) {
            if (error.message.includes('GraphQL error')) {
              return (
              <Message negative>
                <Message.Header>Ошибка!</Message.Header>
                <p>Нет соединения с базой данных!</p>
              </Message>);
            }
            return (
              <Message negative>
                <Message.Header>Ошибка!</Message.Header>
                <p>{error.message}</p>
              </Message>);
          }
          return (
            <RowDiv>
            <Segment padded>
              <Form
                onSubmit={(e) => this.createListItem(e, createList)
                }
                loading={loading}
                error
              >
                <Form.Input
                  fluid
                  name="title"
                  readOnly={readOnly}
                  disabled={loading}
                  placeholder="Наименование списка"
                  value={listItem.title}
                  onChange={this.handleChange}
                  required
                />

                <Form.TextArea
                  className='post-description'
                  name="description"
                  readOnly={readOnly}
                  disabled={loading}
                  placeholder="Текст описания"
                  value={listItem.description}
                  onChange={this.handleChange}
                />

                <Button
                  type="submit"
                  loading={loading}
                  fluid
                  icon
                  labelPosition="left"
                >
                  Добавить список
                </Button>
              </Form>
            </Segment>
            </RowDiv>
          );
        }}
      </Mutation>
      );
    }
}

export default ListCreateForm;
