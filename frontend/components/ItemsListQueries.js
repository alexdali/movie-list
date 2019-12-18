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
      createdDate
      numberOfItems
      userAverageRating
    }
  }
`;


export { COMMENTS_BY_LIST_QUERY, LIST_QUERY };
