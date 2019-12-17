import { User, List, Item } from './models';

/* eslint no-underscore-dangle: [1, { "allow": ["__id"] }] */

// Get single User by Id
const getUser = async (arg) => {
  console.log(`c getUser arg: ${JSON.stringify(arg)}`);
  return User.findById(arg)
    .then((result) => ({
      id: result._id,
      name: result.name,
      email: result.email,
    }))
    .catch((err) => console.error('Error db: ', err));
};

// Get single User by email
const getUserByArg = async (arg) => {
  // console.log(`c getUser arg: ${JSON.stringify(arg)}`);
  console.log(`c getUserByArg arg: ${arg}`);
  const [prop, val] = arg;
  const filter = { [prop]: val };
  console.log(`c getUserByArg filter: ${JSON.stringify(filter)}`);
  return User.find(filter)
    .then((result) => {
      console.log(`c getUserByArg result: ${JSON.stringify(result)}`);
      if (result.length === 0) return null;
      const {
        _id: id, name, email, password,
      } = result[0];
      return {
        id, name, email, password,
      };
    })
    .catch((err) => console.error('Error db: ', err));
};

// Get all Users
const getUsers = async () => User.find()
  .then((result) => {
    console.log(`c getUsers find: ${JSON.stringify(result)}`);
    return result.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }));
  })
  .catch((err) => console.error('Error db: ', err));


// Get all lists
const getLists = async () => List.find()
  .then((result) => {
    console.log(`c getLists find: ${JSON.stringify(result)}`);
    result.map((list) => ({
      id: list._id,
      title: list.title,
      userId: list.userId,
      description: list.description,
      items: list.items,
      numberOfItems: list.numberOfItems,
      listAverageRating: list.listAverageRating,
      createdDate: list.createdDate,
    }));
  })
  .catch((err) => console.error('Error db: ', err));

// Get single List
const getList = async (arg) => List.findById(arg)
  .then((result) => {
    console.log(`c getList findById: ${JSON.stringify(result)}`);
    return ({
      id: result._id,
      title: result.title,
      userId: result.userId,
      description: result.description,
      items: result.items,
      numberOfItems: result.numberOfItems,
      listAverageRating: result.listAverageRating,
      createdDate: result.createdDate,
    });
  })
  .catch((err) => console.error('Error db: ', err));

// // Get single Comment
// const getComment = async (arg) => Comment.findById(arg)
//   .then((result) => {
//     console.log(`c getComment findById: ${JSON.stringify(result)}`);
//     return ({
//       id: result._id,
//       listId: result.listId,
//       userId: result.userId,
//       content: result.content,
//       createdDate: result.createdDate,
//     });
//   })
//   .catch((err) => console.error('Error db: ', err));


// Get all lists by User
const getListsByUser = async (arg) => List.find({ userId: arg.userId })
  .then((result) =>
  // console.log(`c getPostsByUser find: ${JSON.stringify(result)}`);
    result.map((list) => ({
      id: list._id,
      title: list.title,
      userId: list.userId,
      items: list.items,
      listAverageRating: list.listAverageRating,
      description: list.description,
      createdDate: list.createdDate,
    })))
  .catch((err) => console.error('Error db: ', err));

// // Get all comments by List
// const getCommentsByList = async (arg) => {
//   const { listId } = arg;
//   return Comment.find({ listId })
//     .then((result) => {
//       console.log(`c getCommentsByList find: ${JSON.stringify(result)}`);
//       if (result !== []) {
//         return result.map((comment) => ({
//           id: comment._id,
//           userId: comment.userId,
//           listId: comment.postId,
//           content: comment.content,
//           createdDate: comment.createdDate,
//         }));
//       }  return result ;
//     })
//     .catch((err) => console.error('Error db: ', err));
// };
// Get all items by List
const getItemsByList = async (arg) => {
  const { listId } = arg;
  return Item.find({ listId })
    .then((result) => {
      console.log(`c getItemsByList find: ${JSON.stringify(result)}`);
      if (result !== []) {
        return result.map((item) => ({
          id: item._id,
          userId: item.userId,
          listId: item.listId,
          title: item.title,
          yearOfRelease: item.yearOfRelease,
          genre: item.genre,
          plotShort: item.plotShort,
          userRating: item.userRating,
          comment: item.comment,
          createdDate: item.createdDate,
        }));
      } return result;
    })
    .catch((err) => console.error('Error db: ', err));
};

// const getCommentsByUser = async (arg) => Comment.find({ userId: arg.userId })
//   .then((result) => {
//     console.log(`c getCommentsByUser find: ${JSON.stringify(result)}`);
//     return result.map((comment) => ({
//       id: comment._id,
//       userId: comment.userId,
//       listId: comment.postId,
//       content: comment.content,
//       createdDate: comment.createdDate,
//     }));
//   })
//   .catch((err) => console.error('Error db: ', err));
const getItemsByUser = async (arg) => Item.find({ userId: arg.userId })
  .then((result) => {
    console.log(`c getItemsByUser find: ${JSON.stringify(result)}`);
    return result.map((item) => ({
      id: item._id,
      userId: item.userId,
      listId: item.listId,
      title: item.title,
      yearOfRelease: item.yearOfRelease,
      genre: item.genre,
      plotShort: item.plotShort,
      userRating: item.userRating,
      comment: item.comment,
      createdDate: item.createdDate,
    }));
  })
  .catch((err) => console.error('Error db: ', err));

const getDataByUser = async (arg) => {
  try {
    const listsByUser = await getListsByUser({ userId: arg.userId });
    const itemsByUser = await getItemsByUser({ userId: arg.userId });
    console.log(`c getDataByUser listsByUser: ${JSON.stringify(listsByUser)}`);
    console.log(`c getDataByUser itemsByUser: ${JSON.stringify(itemsByUser)}`);
    return ({
      listsByUser,
      itemsByUser,
    });
  } catch (error) {
    console.error('Error db: ', error);
  }
};

export {
  getUsers, getUser, getUserByArg, getLists, getList, getListsByUser, getItemsByList, getItemsByUser, getDataByUser,
};
