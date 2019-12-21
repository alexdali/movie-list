import React, { Component } from 'react';
// import withApollo from 'next-with-apollo';
import { ApolloConsumer } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { graphql } from '@apollo/react-hoc';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Message, Segment, Button, Icon, Form, Rating, Item, Dropdown, Divider,
} from 'semantic-ui-react';
// import TextareaAutosize from 'react-textarea-autosize';
// import Router from 'next/router';
import styled from 'styled-components';
// import moment from 'moment';
import withUserContext from '../lib/withUserContext';
import { LISTS_BY_USER_QUERY } from './ListsByUser';
import { ITEMS_BY_USER_QUERY } from './ItemsListQueries';
// import { ALL_LISTS_QUERY } from './RatingList';
import LoadingBar from './LoadingBar';
import ErrorMessage from './ErrorMessage';


const RowDiv = styled.div`
`;

const UPDATE_ITEM_IN_LISTS_MUTATION = gql`
  mutation UPDATE_ITEM_IN_LISTS_MUTATION(
    $userId: String!
    $itemId: String!
    $lists: [ListInput]!
    $title: String!
    $yearOfRelease: String!
    $genre: String!
    $userRating: Int!
  ) {
    updateItemInLists(
      userId: $userId
      itemId: $itemId
      lists: $lists
      title: $title
      yearOfRelease: $yearOfRelease
      genre: $genre
      userRating: $userRating
      ) {
        id
        title
        userId
        description
        numberOfItems
        userAverageRating
        createdDate
        items {
          id
        }
    }
  }
`;

const withListDataQuery = graphql(
  LISTS_BY_USER_QUERY,
  {
    options: (props) => ({
      variables: {
        id: props.user.id,
      },
    }),
  },
);


class AddToListBlock extends Component {
  // static propTypes = {
  //   searchblock: PropTypes.shape({
  //     id: PropTypes.string,
  //     userId: PropTypes.string,
  //     title: PropTypes.string,
  //     description: PropTypes.string,
  //     items: PropTypes.array,
  //     numberOfItems: PropTypes.number,
  //     userAverageRating: PropTypes.number,
  //     createdDate: PropTypes.string,
  //   }).isRequired,
  // };

  state = {
    listsByUser: [],
    maxRating: 10,
    value: [],
    rating: 0,
  };

  componentDidMount() {
    const { listsByUser } = this.props.data;
    if (listsByUser !== null && listsByUser !== undefined) {
      this.setState({
        listsByUser,
      });
    }
  }

  listToOptions = (listArray) => listArray.map((item) => ({
    key: item.id, text: item.title, name: item.id, value: item.id,
  }));

  resetInput = () => {
    this.setState({
      value: [],
      listsByUser: [],
      rating: 0,
      maxRating: 10,
    });
  }

  handleRate = (e, { rating, maxRating }) => this.setState({ rating, maxRating });

  handleChange = (e, {
    value, name, type, id,
  }) => {
    // console.log(`handleChange data: ${JSON.stringify(data)}`);
    console.log(`handleChange value: ${value}, name: ${name}`);
    // console.log(`handleChange id: ${id}, type: ${type}`);
    // const { name, type, value } = e.target;

    // const val = value;
    // const nam = name;
    // if (id === 'firstParam') {
    //   this.setState({
    //     firstParamVal: val,
    //   });
    // }
    this.setState({ value });
    // const { searchblock } = this.state;
    // searchblock[nam] = val;
    // this.setState({ searchblock });
  };

  // handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery })

  addToLists = async (variables, updateItemInLists, addToListShow) => {
    // console.log('NavBar handleItemClick: e', e);
    console.log('AddToListBlock addToLists this.state.value: ', this.state.value);
    // const { name, value, text } = data;
    // console.log('handleItemClick: value: ', value);
    // const {
    //   user: { id }, item: {
    //     imdbID, title, year: yearOfRelease, genre,
    //   },
    // } = this.props;
    // const { value, rating } = this.state;
    console.log(`AddToListBlock addToLists variables:  ${variables}`);
    // console.log(`AddToListBlock addToLists this.state:  id: ${id}, value: ${value}, rating: ${rating}, imdbID: ${imdbID}`);
    // const ListInput = value.map((item) => ({ listId: item }));
    console.log(`mut addToLists ListInput: ${JSON.stringify(ListInput)}`);

    const res = await updateItemInLists({
      variables: { variables },
      refetchQueries: [
        {
          query: LISTS_BY_USER_QUERY,
          variables: { id },
        },
        {
          query: ITEMS_BY_USER_QUERY,
          variables: { id },
        },
        // {
        //   query: ALL_LISTS_QUERY,
        // },
      ],
    });
    console.log(`mut addToLists res.data.updateItemInLists: ${JSON.stringify(res.data.updateItemInLists)}`);
    // reset state
    this.setState({
      listsByUser: [],
      rating: 0,
      maxRating: 10,
      value: [],
    },
    () => {
      addToListShow();
    });
  };

  render() {
    console.log(`AddToListBlock render this.props: ${JSON.stringify(this.props)}`);
    const {
      user: { id }, item: {
        imdbID, title, yearOfRelease, genre,
      }, data, addToListShow,
    } = this.props;
    console.log(`AddToListBlock render data.listsByUser: ${JSON.stringify(data.listsByUser)}`);
    const {
      value, rating,
    } = this.state;
    const ListInput = value.map((item) => ({ listId: item }));
    const variables = {
      userId: id,
      itemId: imdbID,
      lists: ListInput,
      userRating: rating,
      title,
      year: yearOfRelease,
      genre,
    };

    if (data.loading) return <LoadingBar count={2}/>;
    if (data.error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
    const listOptions = this.listToOptions(data.listsByUser);
    console.log(`AddToListBlock render listOptions: ${JSON.stringify(listOptions)}`);
    console.log(`AddToListBlock render Value: ${value}`);
    return (
      <Mutation
        mutation={UPDATE_ITEM_IN_LISTS_MUTATION}
        variables={ variables }
      >
        {(updateItemInLists, { loading, error }) => {
          if (error) {
            return (
            <Message negative>
              <Message.Header>Ошибка!</Message.Header>
              <p>{error.message.replace('GraphQL error: ', '')}</p>
            </Message>);
          }
          return (
            <>
                <Divider clearing />
                <div>
                  <p>Rate the film</p>
                  <Rating icon='star' onRate={this.handleRate} defaultRating={0} maxRating={10}/>
                </div>
                <Divider horizontal>And</Divider>
                {/* <Segment clearing> */}
                  <Dropdown
                    multiple
                    onChange={this.handleChange}
                    // onSearchChange={this.handleSearchChange}
                    options={listOptions}
                    placeholder='select the lists'
                    // search
                    // searchQuery={searchQuery}
                    selection
                    value={value}
                  />
                  <Button
                    loading={loading}
                    floated='right'
                    onClick={() => this.addToLists(variables, updateItemInLists, addToListShow)}
                  >
                      Add to list
                  </Button>

                  {/* <Segment attached='bottom'>
                    <Button
                    // labelPosition="right"
                    onClick={(e) => this.searchRequest(e, client)}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.resetInput()}>Reset</Button>
                  </Segment> */}

                {/* </Segment> */}
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default withUserContext(withListDataQuery(AddToListBlock));
