import gql from 'graphql-tag';

const COMMENTS_BY_LIST_QUERY = gql`
  query COMMENTS_BY_LIST_QUERY ($id: String!) {
    commentsByPost(id: $id) {
      id
      listId
      userId
      content
      createdDate
    }
  }
`;

const LIST_QUERY = gql`
  query LIST_QUERY(
    $id: String!
  ) {
    list(id: $id) {
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

const ITEMS_BY_USER_QUERY = gql`
  query ITEMS_BY_USER_QUERY(
    $id: String!
  ) {
    itemsByUser(id: $id) {
      id
      title
      userId
      genre
      yearOfRelease
      #plotShort
      userRating
      #comment
      createdDate
      list {
        id
        #userId
        title
        #description
        #numberOfItems
        #userAverageRating
        #createdDate
      }
    }
  }
`;


const ITEMS_BY_LIST_QUERY = gql`
  query ITEMS_BY_LIST_QUERY(
    $id: String!
  ) {
    itemsByList(id: $id) {
      id
      title
      userId
      genre
      yearOfRelease
      plotShort
      userRating
      comment
      createdDate
      list {
        id
        userId
        items {
          id
        }
        title
        description
        numberOfItems
        userAverageRating
        createdDate
      }
    }
  }
`;


export {
  COMMENTS_BY_LIST_QUERY, LIST_QUERY, ITEMS_BY_USER_QUERY, ITEMS_BY_LIST_QUERY,
};
