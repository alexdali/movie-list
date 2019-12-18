import React, { Component } from 'react';
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
// import CommentBlock from './CommentBlock';


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


const SEARCH_ITEM_QUERY = gql`
  mutation SEARCH_ITEM_QUERY(
    $title: String!
    $itemId: String!
    $year: String!
    $genre: String!
  ) {
    searchItem(
      title: $title
      itemId: $itemId
      year: $year
      genre: $genre
      ) {
        imdbID
        title
        year
        rated
        released
        genre
        director
        actors
        language
        plot
        country
        imdbRating
        imdbVotes
        type
    }
  }
`;

const ResultBlock = (props) => {
  // const {
  //   showEdit, enableEdit, updatePostItem, updateList, loadingUpdate, deletePostItem, deleteList,
  // } = props.updateProps;
  const { item } = props;
  return (
          <Item>
            {/* <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' /> */}

            <Item.Content>
              <Item.Header as='a'>{item.title}</Item.Header>
              <Item.Meta>
                <span className='cinema'>{item.yearOfRelease || ''}</span>
                <span className='cinema'>{item.genre || ''}</span>
                <span className='cinema'>{item.plotShort || ''}</span>
              </Item.Meta>
              <Item.Description>{item.plotShort || ''}</Item.Description>
              {/* <Item.Description>{item.comment || ''}</Item.Description> */}
              <Item.Extra>
                <Button floated='right'>
                  Add to list
                  <Icon name='right chevron' />
                </Button>
                {/* <Label>IMAX</Label>
                <Label icon='globe' content='Additional Languages' /> */}
              </Item.Extra>
              <Rating icon='star' defaultRating={5} maxRating={10} />
            </Item.Content>
          </Item>
  );
};

/* eslint-disable */
const Composed = adopt({
  searchItemQuery: ({render}) => <Query mutation={SEARCH_ITEM_QUERY}>{render}</Query>,
  // removeItemMutate: ({render}) => <Mutation mutation={REMOVE_ITEM_MUTATION}>{render}</Mutation>,
  // deleteListMutate: ({render}) => <Mutation mutation={DELETE_LIST_MUTATION}>{render}</Mutation>,
});
/* eslint-enable */

class SearchBlock extends Component {
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
    searchblock: {
      title: '',
      id: '',
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

  resetInput = () => {
    this.setState({
      // showEdit: '',
      // readOnly: true,
      searchblock: {
        title: '',
        itemId: '',
        year: '',
        genre: '',
      },
    });
  }

  handleChange = (e, data) => {
    // const { name, type, value } = e.target;
    // const val = value;
    // const nam = name;

    // const { searchblock } = this.state;
    // searchblock[nam] = val;
    // this.setState({ searchblock });
  };

  searchItem = async (e, searchItemQuery) => {
    e.preventDefault();
    const {
      title, itemId, year, genre,
    } = this.state.searchblock;
    const res = await searchItemQuery({
      variables: {
        title, itemId, year, genre,
      },
      // refetchQueries: [
      //   {
      //     query: COMMENTS_BY_LIST_QUERY,
      //     variables: { id: listId },
      //   },
      //   {
      //     query: LIST_QUERY,
      //     variables: { id: listId },
      //   },
      //   {
      //     query: CURRENT_USER_QUERY,
      //   },
      // ],
    });
    console.log(`q searchItem res: ${JSON.stringify(res)}`);
    // TO-DO handle key press: Enter
    this.setState({
      // showEdit: '',
      // readOnly: true,
      searchblock: {
        title: '',
        itemId: '',
        year: '',
        genre: '',
      },
      resultSearch: res,
    });
  };


  render() {
    // const user = this.props.user ? this.props.user : {
    //   id: '',
    //   name: '',
    //   email: '',
    // };
    const options = [
      { key: 'title', text: 'title', value: 'title' },
      { key: 'ID', text: 'ID', value: 'itemId' },
    ];
    const {
      searchblock,
      // authorIsCurrentUser,
      // readOnly,
      // showEdit,
      resultSearch,
    } = this.state;
    // const updateProps = {
    //   showEdit, enableEdit: this.enableEdit, updatePostItem: this.updatePostItem, deletePostItem: this.deletePostItem,
    // };
    // const itemProps = {updateRatingItem, ListArray};
    return (
      <Composed>
      {({
        searchItemQuery,
      }) =>
      // const { loading: loadingUpdate, error: errorUpdate } =updateListMutate;
      // itemProps.updateList = updateListMutate;
      // const itemProps = { removeItemMutate, updateListMutate };
      /* if (errorUpdate) {
          return (
          <Message negative>
            <Message.Header>Ошибка!</Message.Header>
            <p>{errorUpdate.message.replace('GraphQL error: ', '')}</p>
          </Message>);
        } */
        (
          <RowDiv>
            <Segment>
              <Form
                className='form-search'
                onSubmit={(e) => this.searchItem(e, searchItemQuery)
                }
                // loading={loading}
                // error
              >
                <Input
                  label={<Dropdown defaultValue='title' options={options} />}
                  labelPosition='right'
                  placeholder='Find movie'
                />

                {/* <Form.Field
                  control={TextareaAutosize}
                  className='title-view'
                  name="title"
                  readOnly={readOnly}
                  disabled={loadingUpdate}
                  defaultValue={searchblock.title}
                  onChange={this.handleChange}
                /> */}

                <Form.Group>
                  <Form.Input
                    fluid
                    label="Year of release"
                    id="year"
                    name="year"
                    // disabled={loading}
                    width={8}
                    // required
                    // defaultValue={profileTP.name || ''}
                    value={searchblock.year}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    label="Genre"
                    name="genre"
                    value={searchblock.genre}
                    width={8}
                    // required
                  />
                </Form.Group>

                <div className="list-meta">
                  <p>div</p>
                </div>

                <Segment attached='bottom'>
                  <Button
                      type="submit"
                      // loading={loading}
                      fluid
                      icon
                      labelPosition="right"
                    >
                      Search
                  </Button>
                  {/* <Button
                    onClick={() => this.search(searchItemQuery)}
                    >
                      Search
                  </Button> */}
                  <Button onClick={() => this.resetInput()}>Reset</Button>
                </Segment>
                {/*
                  authorIsCurrentUser
                  && <UpdateBlock updateProps={updateProps} /> */
                }
              </Form>
            </Segment>
            <Item.Group divided>
              {
                resultSearch.map((item) => (<ResultBlock item={item} />))
              }
            </Item.Group>

          </RowDiv>
        )
      }
      </Composed>
    );
  }
}

export default withUserContext(SearchBlock);
