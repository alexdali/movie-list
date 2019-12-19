import React, { Component } from 'react';
// import withApollo from 'next-with-apollo';
import { ApolloConsumer } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
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
// import { ALL_LISTS_QUERY } from './RatingList';
// import { CURRENT_USER_QUERY } from './User';
import AddToListBlock from './AddToListBlock';


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
  .list-meta {
    display: flexbox;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1em 2em 0;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  }
  div.field.description-view > textarea {
    width: 100%;
    max-height: 100%;
    font-size: 1.5em;
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    resize: none;
  }
  .ui.form > div.field.list-content > textarea {
    font-size: 1.5em;
    border: none;
    max-height: 100%;
    resize: none;
  }
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

// const ResultBlock = (props) => {
//   const { item } = props;
//   return (
//           <Segment>
//             <Item>
//               {/* <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' /> */}
//               <Item.Content>
//                 <Item.Header as='h3'>{item.title}</Item.Header>
//                 <Item.Meta>
//                   <span className='cinema'>{item.year || ''}</span>
//                   <span className='cinema'>{item.released || ''}</span>
//                   <span className='cinema'>{item.genre || ''}</span>
//                   <span className='cinema'>{item.imdbRating || ''}</span>
//                   <span className='cinema'>{item.imdbVotes || ''}</span>
//                   <span className='cinema'>{item.type || ''}</span>
//                   <span className='cinema'>{item.country || ''}</span>
//                   <span className='cinema'>{item.language || ''}</span>
//                   <span className='cinema'>{item.rated || ''}</span>
//                 </Item.Meta>
//                 <Item.Description>Plot: {item.plot || ''}</Item.Description>
//                 <Item.Description>Director: {item.director || ''}</Item.Description>
//                 <Item.Description>Actors: {item.actors || ''}</Item.Description>
//                 <Item.Extra>
//                   <Button floated='right'>
//                     Add to list
//                     <Icon name='right chevron' />
//                   </Button>
//                   <Rating icon='star' defaultRating={5} maxRating={10} />
//                 </Item.Extra>

//               </Item.Content>
//             </Item>
//           </Segment>
//   );
// };

/* eslint-disable */
// const Composed = adopt({
//   searchItemQuery: ({render}) => <Query query={SEARCH_ITEM_QUERY}>{render}</Query>,
//   // removeItemMutate: ({render}) => <Mutation mutation={REMOVE_ITEM_MUTATION}>{render}</Mutation>,
//   // deleteListMutate: ({render}) => <Mutation mutation={DELETE_LIST_MUTATION}>{render}</Mutation>,
// });
/* eslint-enable */

class ResultBlock extends Component {
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
    // searchblock: this.props.searchblock,
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


  // //fn for enable/disable edit list
  // enableEdit = (val) => {
  //   if (val === '1') {
  //     this.setState({
  //       showEdit: '1',
  //       readOnly: false,
  //     });
  //   } else {
  //     this.setState({
  //       showEdit: '',
  //       readOnly: true,
  //       searchblock: this.props.searchblock,
  //     });
  //   }
  // };

  // resetInput = () => {
  //   this.setState({
  //     firstParamText: 'by Title',
  //     firstParamName: 'title',
  //     searchByID: false,
  //     firstParamVal: '',
  //     searchblock: {
  //       // firstParamVal: '',
  //       title: '',
  //       imdbID: '',
  //       year: '',
  //       genre: '',
  //     },
  //     // showEdit: '',
  //     resultSearch: [],
  //   });
  // }

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

  // handleItemClick = (e, data) => {
  //   // console.log('NavBar handleItemClick: e', e);
  //   // console.log('handleItemClick data: ', data);
  //   const { name, value, text } = data;
  //   // console.log('handleItemClick: value: ', value);
  //   this.setState({
  //     firstParamText: text,
  //     firstParamName: value,
  //   });
  //   if (value === 'imdbID') {
  //     this.setState({
  //       searchByID: true,
  //     });
  //   }
  // };

  // searchRequest = async (e, client) => {
  //   e.preventDefault();
  //   const {
  //     title, imdbID, year, genre,
  //   } = this.state.searchblock;

  //   const res = await client.query({
  //     query: SEARCH_ITEM_QUERY,
  //     variables: {
  //       title, imdbID, year, genre,
  //     },
  //   });
  //   console.log(`q searchItem res.data.searchItem: ${JSON.stringify(res.data.searchItem)}`);
  //   // TO-DO handle key press: Enter
  //   this.setState({
  //     firstParamText: 'by Title',
  //     firstParamName: 'title',
  //     searchByID: false,
  //     firstParamVal: '',
  //     searchblock: {
  //       title: '',
  //       imdbID: '',
  //       year: '',
  //       genre: '',
  //     },
  //     // showEdit: '',
  //     resultSearch: res.data.searchItem,
  //   });
  // };


  render() {
    const { item } = this.props;
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
          <Segment>
            <ApolloConsumer>
              {(client) => (
                // <Form
                // className='form-search'
                // onSubmit={(e) => this.searchRequest(e, client)}
                // loading={loading}
                // error
                // >
                <Item.Group divided>
                  <Segment>
                    <Item>
                      {/* <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' /> */}
                      <Item.Content>
                        <Item.Header as='h3'>{item.title}</Item.Header>
                        <Item.Meta>
                          <span className='cinema'>{item.year || ''}</span>
                          <span className='cinema'>{item.released || ''}</span>
                          <span className='cinema'>{item.genre || ''}</span>
                          <span className='cinema'>{item.imdbRating || ''}</span>
                          <span className='cinema'>{item.imdbVotes || ''}</span>
                          <span className='cinema'>{item.type || ''}</span>
                          <span className='cinema'>{item.country || ''}</span>
                          <span className='cinema'>{item.language || ''}</span>
                          <span className='cinema'>{item.rated || ''}</span>
                        </Item.Meta>
                        <Item.Description>Plot: {item.plot || ''}</Item.Description>
                        <Item.Description>Director: {item.director || ''}</Item.Description>
                        <Item.Description>Actors: {item.actors || ''}</Item.Description>
                        <Item.Extra>
                          <Button floated='right'>
                            Add to list
                            <Icon name='right chevron' />
                          </Button>
                          <Rating icon='star' defaultRating={5} maxRating={10} />
                        </Item.Extra>

                      </Item.Content>
                    </Item>
                  </Segment>

                  {/* <Segment attached='bottom'>
                    <Button
                    onClick={(e) => this.searchRequest(e, client)}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.resetInput()}>Reset</Button>
                  </Segment> */}
                  {/* </Form> */}
                </Item.Group>
              )}
                </ApolloConsumer>
          </Segment>
          <AddToListBlock/>
        </RowDiv>
    );
  }
}

export default ResultBlock;
