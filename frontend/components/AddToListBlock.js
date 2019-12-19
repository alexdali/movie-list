import React, { Component } from 'react';
// import withApollo from 'next-with-apollo';
import { ApolloConsumer } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { graphql } from '@apollo/react-hoc';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Message, Segment, Button, Icon, Form, Rating, Item, Dropdown, Input,
} from 'semantic-ui-react';
// import TextareaAutosize from 'react-textarea-autosize';
// import Router from 'next/router';
import styled from 'styled-components';
// import moment from 'moment';
import withUserContext from '../lib/withUserContext';
import { LISTS_BY_USER_QUERY } from './ListsByUser';
// import { CURRENT_USER_QUERY } from './User';
// import ResultBlock from './ResultBlock';

const RowDiv = styled.div`
`;

// const SEARCH_ITEM_QUERY = gql`
//   query SEARCH_ITEM_QUERY(
//     $title: String
//     $imdbID: String
//     $year: String
//     $genre: String
//   ) {
//     searchItem(
//       title: $title
//       imdbID: $imdbID
//       year: $year
//       genre: $genre
//       ) {
//         imdbID
//         title
//         year
//         rated
//         released
//         genre
//         director
//         actors
//         language
//         plot
//         country
//         imdbRating
//         imdbVotes
//         type
//     }
//   }
// `;

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

const listOptions = [
  // {
  //   key: 'title', text: 'by Title', name: 'title', value: 'title', onClick: this.handleItemClick,
  // },
  // {
  //   key: 'ID', text: 'by ID', name: 'imdbID', value: 'imdbID', onClick: this.handleItemClick,
  // },
];


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
    listsByUser: this.props.data.listsByUser,
    // authorIsCurrentUser: false,
    // readOnly: false,
    firstParamText: 'by Title',
    firstParamName: 'title',
    searchByID: false,
    firstParamVal: '',
    searchblock: {
      title: '',
      imdbID: '',
      year: '',
      genre: '',
    },
    // showEdit: '',
    resultSearch: [],
  };


  resetInput = () => {
    this.setState({
      firstParamText: 'by Title',
      firstParamName: 'title',
      searchByID: false,
      firstParamVal: '',
      searchblock: {
        // firstParamVal: '',
        title: '',
        imdbID: '',
        year: '',
        genre: '',
      },
      // showEdit: '',
      resultSearch: [],
    });
  }

  handleChange = (e, {
    value, name, type, id,
  }) => {
    // console.log(`handleChange data: ${JSON.stringify(data)}`);
    // console.log(`handleChange value: ${value}, name: ${name}`);
    // console.log(`handleChange id: ${id}, type: ${type}`);
    // const { name, type, value } = e.target;

    const val = value;
    const nam = name;
    if (id === 'firstParam') {
      this.setState({
        firstParamVal: val,
      });
    }

    const { searchblock } = this.state;
    searchblock[nam] = val;
    this.setState({ searchblock });
  };

  handleItemClick = (e, data) => {
    // console.log('NavBar handleItemClick: e', e);
    // console.log('handleItemClick data: ', data);
    const { name, value, text } = data;
    // console.log('handleItemClick: value: ', value);
    this.setState({
      firstParamText: text,
      firstParamName: value,
    });
    if (value === 'imdbID') {
      this.setState({
        searchByID: true,
      });
    }
  };

  render() {
    console.log(`AddToListBlock render this.props: ${JSON.stringify(this.props)}`);
    const { user, data } = this.props;
    console.log(`AddToListBlock render data.listsByUser: ${JSON.stringify(data.listsByUser)}`);
    const {
      searchblock: {
        title, itemId, year, genre,
      },
      firstParamText,
      firstParamName,
      firstParamVal,
      // readOnly,
      // showEdit,
      resultSearch,
    } = this.state;

    return (
        <RowDiv>
            <ApolloConsumer>
              {(client) => (
                <Segment>
                  <Input
                    // label={<Dropdown defaultValue='title' options={options} />}
                    label={<Dropdown text={firstParamText} options={listOptions} />}
                    id="firstParam"
                    name={firstParamName}
                    value={firstParamVal}
                    labelPosition='right'
                    placeholder='Find movie'
                    onChange={this.handleChange}
                  />

                  {/* <Segment attached='bottom'>
                    <Button
                    // labelPosition="right"
                    onClick={(e) => this.searchRequest(e, client)}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.resetInput()}>Reset</Button>
                  </Segment> */}

                </Segment>
              )}
            </ApolloConsumer>
        </RowDiv>
    );
  }
}

export default withUserContext(withListDataQuery(AddToListBlock));
