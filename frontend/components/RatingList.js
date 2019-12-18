import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Item, Segment } from 'semantic-ui-react';
import withUserContext from '../lib/withUserContext';
import LoadingBar from './LoadingBar';
import ListCard from './ListCard';
import ErrorMessage from './ErrorMessage';
import SearchBlock from './SearchBlock';

const ALL_LISTS_QUERY = gql`
  query ALL_LISTS_QUERY {
    lists {
      id
      title
      userId
      description
      createdDate
      numberOfItems
      userAverageRating
    }
  }
`;

const RowDiv = styled.div`
  margin: 52px 0 0;
`;


const RatingList = (props) => {
  let { authors } = props;
  if (authors === null) authors = [];
  return (
    <RowDiv>
      <SearchBlock/>
      <Query query={ALL_LISTS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <LoadingBar count={10}/>;
          if (error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
          if ((typeof data === 'undefined') || (data.lists.length === 0)) return null;
          return (
            <Item.Group divided relaxed='very'>
              {data.lists.map((item) => {
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
              })
              }
            </Item.Group>
          );
        }}
      </Query>
    </RowDiv>);
};

export { ALL_LISTS_QUERY };
export default withUserContext(RatingList);
