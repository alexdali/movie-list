import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Message, Segment, Button, Icon, Form, Rating,
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

// const UpdateBlock = (props) => {
//   const {
//     showEdit, enableEdit, updatePostItem, updateList, loadingUpdate, deletePostItem, deleteList,
//   } = props.updateProps;
//   return (
//     <>
//       {showEdit === '' ? (
//         <Button.Group basic attached='bottom'>
//           <Button
//             icon
//             size="large"
//             onClick={() => enableEdit('1')}
//           >
//             <Icon name="edit outline" />
//           </Button>
//           <Button
//             icon size="large"
//             onClick={() => deletePostItem(deleteList)}
//           >
//             <Icon name="trash alternate outline" />
//           </Button>
//         </Button.Group>
//       ) : (
//         <Segment attached='bottom'>
//           <Button
//             onClick={() => updatePostItem(updateList)}
//             >
//               Обнов{loadingUpdate ? 'ление' : 'ить'}
//           </Button>
//           <Button onClick={() => enableEdit('')}>Отмена</Button>
//         </Segment>
//       )}
//     </>
//   );
// };

const ListItem = (props) => {
  // const {
  //   showEdit, enableEdit, updatePostItem, updateList, loadingUpdate, deletePostItem, deleteList,
  // } = props.updateProps;
  const {
    updateListMutate, removeItemMutate, item
  } = props.itemProps;
  return (
          <Item>
            <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

            <Item.Content>
              <Item.Header as='a'>{item.title}</Item.Header>
              <Item.Meta>
                <span className='cinema'>{item.yearOfRelease}</span>
                <span className='cinema'>{item.genre}</span>
                <span className='cinema'>{item.plotShort}</span>
              </Item.Meta>
              <Item.Description>{item.plotShort}</Item.Description>
              <Item.Description>{item.comment}</Item.Description>
              <Item.Extra>
                <Button floated='right'>
                  Buy tickets
                  <Icon name='right chevron' />
                </Button>
                <Label>IMAX</Label>
                <Label icon='globe' content='Additional Languages' />
              </Item.Extra>
              <Rating icon='star' defaultRating={5} maxRating={10} />
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
  //       listblock: this.props.listblock,
  //     });
  //   }
  // };

  handleChange = (e, data) => {
    // const { name, type, value } = e.target;
    // const val = value;
    // const nam = name;

    // const { listblock } = this.state;
    // listblock[nam] = val;
    // this.setState({ listblock });
  };

  // updatePostItem = async (updateList) => {
  //   const { listblock } = this.state;
  //   const res = await updateList({
  //     variables: {
  //       userId: listblock.userId,
  //       listId: listblock.id,
  //       title: listblock.title,
  //       content: listblock.content,
  //     },
  //     refetchQueries: [{
  //       query: ALL_LISTS_QUERY,
  //     }],
  //   });
  //   this.setState({
  //     listblock: this.props.listblock,
  //     showEdit: '',
  //     readOnly: true,
  //   });
  // };

  // deletePostItem = async (deleteList) => {
  //   const { listblock } = this.state;
  //   const { user } = this.props;
  //   const res = await deleteList({
  //     variables: {
  //       listId: listblock.id,
  //       userId: user.id,
  //     },
  //     refetchQueries: [{
  //       query: ALL_LISTS_QUERY,
  //     },
  //     {
  //       query: CURRENT_USER_QUERY,
  //     }],
  //   });

  //   if (res) {
  //     Router.push({
  //       pathname: '/list',
  //     });
  //   }
  // };

  render() {
    const user = this.props.user ? this.props.user : {
      id: '',
      name: '',
      email: '',
    };
    const {
      listblock,
      authorIsCurrentUser,
      readOnly,
      showEdit,
    } = this.state;
    // const updateProps = {
    //   showEdit, enableEdit: this.enableEdit, updatePostItem: this.updatePostItem, deletePostItem: this.deletePostItem,
    // };
    //const itemProps = {updateRatingItem, ListArray};
    return (
      <Composed>
      {({
        updateListMutate, deleteListMutate, removeItemMutate,
      }) => {
        const { loading: loadingUpdate, error: errorUpdate } = updateListMutate;
        //itemProps.updateList = updateListMutate;
        //itemProps.deleteList = deleteListMutate;
        //itemProps.removeItem = removeItemMutate;
        const itemProps = {removeItemMutate, updateListMutate};
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

              <Item.Group divided>
                {
                  listblock.items.map((item) => {
                    itemProps.item = { ...item };
                    //comment.author = { ...author };
                    return (<ListItem key={item.id} {...itemProps}/>);
                  })
                }
              </Item.Group>
              {/* <Form>
                <Form.Field
                  control={TextareaAutosize}
                  className='list-content'
                  name="content"
                  readOnly={readOnly}
                  disabled={loadingUpdate}
                  defaultValue={listblock.content}
                  onChange={this.handleChange}
                  placeholder='Текст поста'
                />
              </Form> */}
              {/*
                authorIsCurrentUser
                && <UpdateBlock updateProps={updateProps} /> */
              }
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
