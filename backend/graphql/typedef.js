
import { gql } from 'apollo-server-express';

const typeDefs = gql`

# enum OrderByCreatedDateInput {
#   createdDate_ASC
#   createdDate_DESC
# }

scalar DateTime
type Token {
  token: String!
}
type SuccessMessage {
  message: String
}

input ListInput {
  listId: String!
}

type User {
  id: String!
  name: String!
  email: String!
  password: String!
  numberOfLists: Int!
  numberOfItems: Int!
}

type List {
  id: String!
  title: String!
  userId: String!
  description: String
  numberOfItems: Int!
  userAverageRating: Int!
  createdDate: DateTime!
  items: [Item]!
}

type Item {
  id: String!
  userId: String!
  list: [List]!
  title: String!
  yearOfRelease: String!
  genre: String!
  plotShort: String!
  userRating: Int!
  comment: String
  createdDate: DateTime!
}

type ItemDB {
  imdbID: String!
  title: String!
  year: String!
  rated: String!
  released: String!
  genre: String!
  director: String!
  actors: String!
  language: String!
  plot: String!
  country: String!
  imdbRating: String!
  imdbVotes: String!
  type: String!
}

#type Comment {
#  id: String!
#  userId: String!
#  content: String
#  createdDate: DateTime!
#  postId: String!
#}

type Query {
  me: User
  user(id: String!): User
  users: [User]!
  list(id: String!): List
  lists: [List]!
  item(id: String!): Item
  listsByUser(id: String!): [List]!
  itemsByUser(id: String!): [Item]!
  itemsByList(id: String!): [Item]!
  searchItem(title: String, itemId: String, year: String, genre: String): [ItemDB]!
}

type Mutation {
  signUp(name: String!, email: String!, password: String!): User!
  signIn(email: String!, password: String!): User
  signOut: SuccessMessage
  updatePassword(password: String!): SuccessMessage
  deleteUser(userId: String!, password: String!): SuccessMessage
  createList(userId: String!, title: String!, description: String!): List!
  #deleteList(listId: String!, userId: String!): SuccessMessage
  updateItemInLists(userId: String!, lists: [ListInput]!, itemId: String!, userRating: Int!, ): [List]!
  removeItemFromList(userId: String!, listId: String!, itemId: String!): List!
  updateItem(userId: String!, itemId: String!, userRating: Int!, comment: String!): Item!
  deleteItem(id: String!, userId: String!): SuccessMessage
  #deleteItemFromList(userId: String!, listId: String!, itemId: String!): SuccessMessage
  #createComment(userId: String!, postId: String!, content: String!): Comment
  #deleteComment(id: String!, userId: String!): SuccessMessage
}
`;

export default typeDefs;
