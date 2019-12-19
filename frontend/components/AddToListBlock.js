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
// import { CURRENT_USER_QUERY } from './User';
import LoadingBar from './LoadingBar';


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


// const listOptions = [
// {
//   key: 'title', text: 'by Title', name: 'title', value: 'title', onClick: this.handleItemClick,
// },
// {
//   key: 'ID', text: 'by ID', name: 'imdbID', value: 'imdbID', onClick: this.handleItemClick,
// },
// ];


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
    rating: 0,
    maxRating: 10,
    // // readOnly: false,
    // firstParamText: 'by Title',
    // firstParamName: 'title',
    // searchByID: false,
    // firstParamVal: [],
    value: [],
    // searchblock: {
    //   title: '',
    //   imdbID: '',
    //   year: '',
    //   genre: '',
    // },
    // showEdit: '',
    // resultSearch: [],
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
      // firstParamText: 'by Title',
      // firstParamName: 'title',
      // searchByID: false,
      value: [],
      // searchblock: {
      //   // firstParamVal: '',
      //   title: '',
      //   imdbID: '',
      //   year: '',
      //   genre: '',
      // },
      // showEdit: '',
      // resultSearch: [],
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

  addToLists = (e, data) => {
    // console.log('NavBar handleItemClick: e', e);
    console.log('AddToListBlock addToLists this.state.value: ', this.state.value);
    // const { name, value, text } = data;
    // console.log('handleItemClick: value: ', value);
    // this.setState({
    //   firstParamText: text,
    //   firstParamName: value,
    // });
    // if (value === 'imdbID') {
    //   this.setState({
    //     searchByID: true,
    //   });
    // }
  };

  render() {
    // console.log(`AddToListBlock render this.props: ${JSON.stringify(this.props)}`);
    const { user, data } = this.props;
    console.log(`AddToListBlock render data.listsByUser: ${JSON.stringify(data.listsByUser)}`);
    const {
      // searchblock: {
      //   title, itemId, year, genre,
      // },
      // firstParamText,
      // firstParamName,
      // firstParamVal,
      // searchQuery,
      // showEdit,
      value,
      // resultSearch,
    } = this.state;

    // return (
    if (data.loading) return <LoadingBar count={2}/>;
    if (data.error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
    const listOptions = this.listToOptions(data.listsByUser);
    console.log(`AddToListBlock render listOptions: ${JSON.stringify(listOptions)}`);
    console.log(`AddToListBlock render Value: ${value}`);
    return (
    // <RowDiv>
            <ApolloConsumer>
              {(client) => (
                <>
                <Divider clearing />
                <div>
                  <p>Rate the film</p>
                  <Rating icon='star' onRate={this.handleRate} defaultRating={0} maxRating={10}/>
                </div>
                <Divider horizontal>And</Divider>
                {/* <Segment clearing> */}
                  <Dropdown
                    // fluid
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
                    // labelPosition="right"
                    floated='right'
                    onClick={(e) => this.addToLists(e, client)}
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
              )}
            </ApolloConsumer>
    // </RowDiv>
    );
    // );
  }
}

export default withUserContext(withListDataQuery(AddToListBlock));
