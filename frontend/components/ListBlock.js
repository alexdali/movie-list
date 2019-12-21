import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Message, Segment, Button, Icon, Form, Rating, Item, Label,
} from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import Router from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import withUserContext from '../lib/withUserContext';
import { ALL_LISTS_QUERY } from './RatingList';
import { CURRENT_USER_QUERY } from './User';
import CommentBlock from './CommentBlock';


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

const UPDATE_LIST_MUTATION = gql`
  mutation UPDATE_LIST_MUTATION(
    $userId: String!
    $lists: [String]!
    $itemId: String!
    $userRating: Int!
  ) {
    updateItemInLists(
      userId: $userId
      lists: $lists
      itemId: $itemId
      userRating: $userRating
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

const REMOVE_ITEM_MUTATION = gql`
  mutation REMOVE_ITEM_MUTATION(
    $userId: String!
    $listId: String!
    $itemId: String!
  ) {
    removeItemFromList(
      userId: $userId
      listId: $listId
      itemId: $itemId
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


const DELETE_LIST_MUTATION = gql`
  mutation DELETE_LIST_MUTATION(
    $listId: String!
    $userId: String!
  ) {
    deleteList(
      listId: $listId
      userId: $userId
      ) {
        message
    }
  }
`;


const ListItem = (props) => {
  // const {
  //   showEdit, enableEdit, updatePostItem, updateList, loadingUpdate, deletePostItem, deleteList,
  // } = props.updateProps;
  const { item } = props;
  return (
          <Item>
            <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

            <Item.Content>
              <Item.Header as='a'>{'item.title'}</Item.Header>
              <Item.Meta>
                <span className='cinema'>{item.id}</span>
              </Item.Meta>
              <Item.Meta>
                <span className='cinema'>{'item.yearOfRelease'}</span>
              </Item.Meta>
              <Item.Meta>
                <span className='cinema'>{'item.genre'}</span>
              </Item.Meta>
              <Item.Meta>
                <span className='cinema'>{'item.plotShort'}</span>
              </Item.Meta>
              <Item.Description>{'item.plotShort'}</Item.Description>
              <Item.Description>{'item.comment'}</Item.Description>
              <Item.Extra>
              <Rating icon='star' defaultRating={item.userRating} maxRating={10} />
                <Button floated='right'>
                  Buy tickets
                  <Icon name='right chevron' />
                </Button>
                {/* <Label>IMAX</Label> */}
                {/* <Label icon='globe' content='Additional Languages' /> */}
              {/*
                TO-DO: query by item.list.id

                item.lists.length === 0 ? null
                  : <>
                      <p>Ratings with this film: </p>
                      items.lists.map((list) => <Label>list.id</Label>)
                  </>
              */}
              </Item.Extra>
            </Item.Content>
          </Item>
  );
};

/* eslint-disable */
const Composed = adopt({
  updateListMutate: ({render}) => <Mutation mutation={UPDATE_LIST_MUTATION}>{render}</Mutation>,
  removeItemMutate: ({render}) => <Mutation mutation={REMOVE_ITEM_MUTATION}>{render}</Mutation>,
  deleteListMutate: ({render}) => <Mutation mutation={DELETE_LIST_MUTATION}>{render}</Mutation>,
});
/* eslint-enable */

class ListBlock extends Component {
  static propTypes = {
    listblock: PropTypes.shape({
      id: PropTypes.string,
      userId: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      items: PropTypes.array,
      numberOfItems: PropTypes.number,
      userAverageRating: PropTypes.number,
      createdDate: PropTypes.string,
    }).isRequired,
  };

  state = {
    listblock: this.props.listblock,
    authorIsCurrentUser: false,
    readOnly: true,
    showEdit: '',
  };


  componentDidMount() {
    const { listblock, user } = this.props;
    if (user !== null && listblock.userId === user.id) {
      this.setState({
        authorIsCurrentUser: true,
      });
    }
  }

  render() {
    const user = this.props.user ? this.props.user : {
      id: '',
      name: '',
      email: '',
    };
    const {
      listblock,
      // authorIsCurrentUser,
      readOnly,
      // showEdit,
    } = this.state;
    // const itemProps = {updateRatingItem, ListArray};
    console.log(`Listblock this.props: ${JSON.stringify(this.props)}`);
    return (
      <Composed>
      {({
        updateListMutate, deleteListMutate, removeItemMutate,
      }) => {
        const { loading: loadingUpdate, error: errorUpdate } = updateListMutate;
        // itemProps.updateList = updateListMutate;
        // itemProps.deleteList = deleteListMutate;
        // itemProps.removeItem = removeItemMutate;
        const itemProps = { removeItemMutate, updateListMutate };
        if (errorUpdate) {
          return (
          <Message negative>
            <Message.Header>Ошибка!</Message.Header>
            <p>{errorUpdate.message.replace('GraphQL error: ', '')}</p>
          </Message>);
        }

        return (
          <RowDiv>
            <Segment>
              <Form.Field
                control={TextareaAutosize}
                className='title-view'
                name="title"
                readOnly={readOnly}
                disabled={loadingUpdate}
                defaultValue={listblock.title}
                onChange={this.handleChange}
              />

              <div className="list-meta">
                <p>{listblock.author.name}</p>
                <p>{moment(listblock.createdDate).format('DD MMMM YYYY HH:mm')}</p>
              </div>

              <div className="list-meta">
                <p>Average Rating: {listblock.userAverageRating}</p>
                <Label size="medium" >
                  <Icon name='film'/> {listblock.numberOfItems}
                </Label>

              </div>

              <Form.Field
                control={TextareaAutosize}
                className='description-view'
                name="description"
                readOnly={readOnly}
                disabled={loadingUpdate}
                defaultValue={listblock.description}
                onChange={this.handleChange}
              />

              <Item.Group divided>
                {
                  listblock.items.map((item) =>
                    // itemProps.item = { ...item };
                    // comment.author = { ...author };
                    (<ListItem key={item.id} item = {item}/>))
                }
              </Item.Group>
            </Segment>
            {/* <CommentBlock list={listblock} userId={user.id} /> */}
          </RowDiv>
        );
      }}
      </Composed>
    );
  }
}

export default withUserContext(ListBlock);
