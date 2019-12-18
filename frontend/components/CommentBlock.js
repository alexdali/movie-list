import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
// import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Icon, Header, Divider, Item,
} from 'semantic-ui-react';
import moment from 'moment';
import styled from 'styled-components';
// import NProgress from 'nprogress';
import withUserContext from '../lib/withUserContext';
import CommentCreateForm from './CommentCreateForm';
import { COMMENTS_BY_LIST_QUERY } from './ItemsListQueries';
import LoadingBar from './LoadingBar';
import ErrorMessage from './ErrorMessage';

const CommentDiv = styled.div`
   margin: 2.5em 0 0.5em;
   padding: 0.5em;
   form > div.field.comment-content > textarea {
    resize: none;
  }
 `;

const ItemDiv = styled.div`
  margin: 1.5em 2em 0em;
  border: none;
   border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  .item-meta {
  font-size: 0.65em;
  display: flex;
  justify-content: space-between;
  }
`;

const CommentCard = (props) => {
  console.log('CommentCard props: ', props);
  // static propTypes = {
  //   comment: PropTypes.shape({
  //     id: PropTypes.string,
  //     userId: PropTypes.string,
  //     listId: PropTypes.string,
  //     content: PropTypes.string,
  //     createdDate: PropTypes.string,
  //   }).isRequired,
  // };
  const {
    id, userId, listId, content, createdDate,
  } = props.comment;
  return (
    <ItemDiv>
      <Item.Content>
        <div className='item-meta'>
          <Item.Meta>{props.comment.author.name}</Item.Meta>
          <Item.Meta>{moment(createdDate).format('DD MMMM YYYY HH:mm')}</Item.Meta>
        </div>
        <div>{content}</div>
      </Item.Content>
    </ItemDiv>
  );
};

// TO-DO: pagination

const CommentBlock = (props) => {
  const { list, userId, authors } = props;
  return (
    <Query
      query={COMMENTS_BY_LIST_QUERY}
      variables={{ id: list.id }}
    >
      {({ data, loading, error }) => {
        if (loading) return <LoadingBar count={2}/>;
        // TO-DO handlers errors from server side
        if (error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
        const commentsByList = ((typeof data === 'undefined') || (data.commentsByList.length === 0)) ? [] : data.commentsByList;
        return (
          <CommentDiv>
            <Divider horizontal>
              <Header as='h3'>
                <Icon name='comment alternate outline' />
                Комментарии {commentsByList.length}
              </Header>
            </Divider>
            {userId && <CommentCreateForm {...props}/>}
            <Divider horizontal></Divider>
              <Item.Group divided relaxed='very'>
                {
                  commentsByList.map((item) => {
                    let author = authors.find((el) => el.id === item.userId);
                    if (typeof author === 'undefined') {
                      author = {
                        id: '',
                        name: '',
                        email: '',
                        numberOfLists: 0,
                        numberOfItems: 0,
                      };
                    }
                    const comment = { ...item };
                    comment.author = { ...author };
                    return (<CommentCard key={comment.id} comment={comment} />);
                  })
                }
              </Item.Group>
            </CommentDiv>
        );
      }}
    </Query>
  );
};

export default withUserContext(CommentBlock);
