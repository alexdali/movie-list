import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Item, Segment, Icon } from 'semantic-ui-react';
import withUserContext from '../lib/withUserContext';
import ErrorMessage from './ErrorMessage';
import ListCard from './ListCard';

// const perScreen = 5;

const LISTS_BY_USER_QUERY = gql`
  query LISTS_BY_USER_QUERY($id: String!) {
    listsByUser(id: $id) {
      id
      title
      userId
      description
      numberOfItems
      userAverageRating
      createdDate
      items {
        id
        userId
        #list {
        #  id
        #}
        #title
        #yearOfRelease
        #genre
        #plotShort
        userRating
        #comment
        createdDate
      }
    }
  }
`;

const ListsByUser = (props) => {
  let { authors } = props;
  if (authors === null) authors = [];
  return (
    <Query
      query={LISTS_BY_USER_QUERY}
      variables={{ id: props.id }}
    >
      {({ data, loading, error }) => {
        if (loading) {
          return (<div>
              <p>
              Загрузка...
              <Icon loading name='spinner' />
              {/* <i className="spinner icon"></i> */}
              </p>
            </div>);
        }
        if (error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
        if ((typeof data === 'undefined') || (data.listsByUser.length === 0)) return null;
        return (
          <Item.Group divided relaxed='very'>
            {data.listsByUser.map((item) => {
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
              const list = { ...item };
              list.author = { ...author };
              return (
                <Segment key={list.id}>
                  <ListCard listcard={list} />
                </Segment>
              );
            })}
          </Item.Group>
        );
      }}
    </Query>
  );
};

export { LISTS_BY_USER_QUERY };
export default withUserContext(ListsByUser);
