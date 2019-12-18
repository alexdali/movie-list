import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User, List, Item } from './models';

/* eslint no-underscore-dangle: [1, { "allow": ["__id"] }] */
// Create User
const createUser = async (arg) => {
  console.log(`c createUser arg: ${JSON.stringify(arg)}`);
  const {
    name, email, password,
  } = arg;

  // check if the user exists
  const nameExist = await User.find({ name });
  if (nameExist.length !== 0) {
    throw new Error('Пользователь с таким логином уже существует!');
  }
  const emailExist = await User.find({ email });
  if (emailExist.length !== 0) {
    throw new Error('Пользователь с таким email уже существует!');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const id = new mongoose.Types.ObjectId();
  const user = new User({
    _id: id, name, email, password: hashPassword,
  });
  console.log(`c createUser user: ${JSON.stringify(user)}`);
  return user.save()
    .then((result) => {
      console.log(`c createUser SaveOne: ${JSON.stringify(result)}`);
      const newUser = {
        id: result._id,
        name: result.name,
        email: result.email,
      };
      console.log(`c createUser newUser: ${JSON.stringify(newUser)}`);
      return newUser;
    })
    .catch((err) => console.error('Error db: ', err));
};

// Update Password
const updatePassword = async (arg) => {
  const {
    id: _id, password: newPassword,
  } = arg;

  // const hashPassword = await bcrypt.hash(password, 10);
  const password = await bcrypt.hash(newPassword, 10);

  console.log(`c updatePassword arg: ${JSON.stringify(arg)}`);
  const filter = { _id };
  return User.findOneAndUpdate(filter, { password },
    // If `new` isn't true, `findOneAndUpdate()` will return the
    // document as it was _before_ it was updated.
    { new: true })
    .then((result) => {
      console.log(`c updatePassword findOneAndUpdate: ${JSON.stringify(result)}`);
      const updatedUser = {
        id: result._id,
        name: result.name,
        email: result.email,
      };
      // console.log(`c updatePassword updatedUser: ${JSON.stringify(updatedUser)}`);
      return updatedUser;
    })
    .catch((err) => console.error('Error db: ', err));
};

// Delete User
const deleteUser = async (arg) => {
  console.log(`c deleteUser arg: ${JSON.stringify(arg)}`);
  return User.findByIdAndRemove(arg)
    .then(async (result) => {
      console.log(`c deleteUser findByIdAndRemove: ${JSON.stringify(result)}`);
      // delete all lists by the userId
      if (result !== null) {
        const { _id } = result;
        const delListsByUser = await List.deleteMany({ userId: _id });
        console.log(`c deleteUser delListsByUser: ${JSON.stringify(delListsByUser)}`);
        // delete all comments by the userId
        // const delCommentsByUser = await Comment.deleteMany({ userId: _id });
        // console.log(`c deleteUser delCommentsByUser: ${JSON.stringify(delCommentsByUser)}`);
      }
      return result;
    })
    .catch((err) => console.error('Error db: ', err));
};

// Create List
const createList = async (arg) => {
  // const {
  //   id, title, userId, description, createdDate,
  // } = arg;
  const {
    title, userId, description, createdDate,
  } = arg;
  const id = new mongoose.Types.ObjectId();
  const list = new List({
    _id: id,
    title,
    userId,
    description,
    numberOfItems: 0,
    userAverageRating: 0,
    createdDate,
  });
  return list.save()
    .then((result) => {
      console.log(`c createList result: ${JSON.stringify(result)}`);
      const newList = {
        id: result._id,
        title: result.title,
        userId: result.userId,
        description: result.description,
        numberOfItems: result.numberOfItems,
        userAverageRating: result.userAverageRating,
        createdDate: result.createdDate,
      };
      console.log(`c createList newList: ${JSON.stringify(newList)}`);
      return newList;
    })
    .catch((err) => console.error('Error db: ', err));
};

// Update List
// const updateList = async (arg) => {
//   const {
//     listId: _id, title, userId, description, numberOfItems,
//     userAverageRating, createdDate,
//   } = arg;
//   console.log(`c updateList arg: ${JSON.stringify(arg)}`);
//   const filter = { _id };
//   return List.findOneAndUpdate(filter, { title, description, numberOfItems, userAverageRating },
//     // If `new` isn't true, `findOneAndUpdate()` will return the
//     // document as it was _before_ it was updated.
//     { new: true })
//     .then((result) => {
//       console.log(`c updateList findOneAndUpdate: ${JSON.stringify(result)}`);
//       const updatedList = {
//         id: result._id,
//         title: result.title,
//         userId: result.userId,
//         description: result.description,
//         numberOfItems: result.numberOfItems,
//         userAverageRating: result.userAverageRating,
//         createdDate: result.createdDate,
//       };
//       console.log(`c updateList updatedList: ${JSON.stringify(updatedList)}`);
//       return updatedList;
//     })
//     .catch((err) => console.error('Error db: ', err));
// };

// //update Item's rating
// const updateItemRating = async (arg) => {
//   const {
//     itemId: _id, userRating,
//   } = arg;
//   console.log(`c updateItemRating arg: ${JSON.stringify(arg)}`);
//   const filter = { _id };
//   return Item.findOneAndUpdate(filter, { userRating },
//     // If `new` isn't true, `findOneAndUpdate()` will return the
//     // document as it was _before_ it was updated.
//     { new: true })
//     .then((result) => {
//       console.log(`c updateItemRating findOneAndUpdate: ${JSON.stringify(result)}`);
//       const updatedItem = {
//         id: result._id,
//         lists: result.lists,
//         title: result.title,
//         yearOfRelease: result.yearOfRelease,
//         genre: result.genre,
//         plotShort: result.plotShort,
//         userRating: result.userRating,
//         comment:  result.comment,
//         userId: result.userId,
//         createdDate: result.createdDate,
//       };
//       console.log(`c updateItemRating updatedItem: ${JSON.stringify(updatedItem)}`);
//       return updatedItem;
//     })
//     .catch((err) => console.error('Error db: ', err));
// };

// add and remove Item, update UserRating in Lists
const updateItem = async (arg) => {
  // itemId: _id, lists, userRating, comment,
  const { itemId: _id } = arg;
  const dataItem = { ...arg };
  delete dataItem.itemId;
  console.log(`c updateItem arg: ${JSON.stringify(arg)}`);
  const filter = { _id };
  // return Item.findOneAndUpdate(filter, { lists, userRating, comment },
  return Item.findOneAndUpdate(filter, dataItem,
  // return Item.update(
  //     { _id: list._id},
  //     {
  //       "$set": { "userRating": userRating },
  //       $addToSet: { lists: { $each: lists } }
  //     },
    { new: true })
    .then((result) => {
      // update item in the lists
      // const updItemInLists = await updateItemInLists(arg);
      // if(updItemInLists===null) throw new Error("Error db: error when updating lists");
      console.log(`c updateItem findOneAndUpdate: ${JSON.stringify(result)}`);
      const updatedItem = {
        id: result._id,
        lists: result.lists,
        title: result.title,
        yearOfRelease: result.yearOfRelease,
        genre: result.genre,
        plotShort: result.plotShort,
        userRating: result.userRating,
        comment: result.comment,
        userId: result.userId,
        createdDate: result.createdDate,
      };
      console.log(`c updateItem updatedItem: ${JSON.stringify(updatedItem)}`);
      return updatedItem;
    })
    .catch((err) => console.error('Error db: ', err));
};

// update item in the lists
const updateItemInLists = async (arg) => {
  const { itemId, lists, userRating } = arg;
  // update item's userRating
  // const userRatingItem = await Item.findById(_id, 'userRating');
  // if(userRatingItem !== userRating) {
  const updatedItem = await updateItem(itemId, userRating);
  if (updatedItem === null) throw new Error('Error db: error when updating Item');
  // }
  // iterate all lists in array
  const updatedLists = await lists.map(async (list) => {
    // update each list in array: add item to Items array
    const updList = await List.update(
      { _id: list._id },
      // {"$push": { "items": _id } },
      { $addToSet: { items: { $each: [itemId] } } },
      { new: true },
    )
      .then((result) =>
      // console.log(`c updateItemInLists List.update: ${JSON.stringify(result)}`);
        ({
          id: result._id,
          title: result.title,
          userId: result.userId,
          numberOfItems: result.numberOfItems,
          userAverageRating: result.userAverageRating,
          description: result.description,
          items: result.items,
          createdDate: result.createdDate,
        }))
      .catch((err) => console.error('Error db: ', err));
    return updList;
  });
  return updatedLists;
};


// remove item from the list
const removeItemFromList = async (arg) => {
  const { itemId: _id, listId } = arg;
  console.log(`c removeItemFromList arg: ${JSON.stringify(arg)}`);
  const updatedItem = await Item.update(
    { _id },
    { $pull: { lists: listId } },
    { new: true },
  )
    .then((result) => {
      if (result === null) throw new Error('Error db: error when updating Item');
      console.log(`c removeItemFromList Item.update: ${JSON.stringify(result)}`);
      return result;
    })
    .catch((err) => console.error('Error db: ', err));

  // update the list: remove the item from Items array
  const updatedList = await List.update(
    { _id: listId },
    { $pull: { items: updatedItem._id } },
    { new: true },
  )
    .then((result) =>
      // console.log(`c updateItemInLists List.update: ${JSON.stringify(result)}`);
      ({
        id: result._id,
        title: result.title,
        userId: result.userId,
        // numberOfItems: result.numberOfItems,
        items: result.items,
        userAverageRating: result.userAverageRating,
        description: result.description,
        createdDate: result.createdDate,
      }))
    .catch((err) => console.error('Error db: ', err));

  return updatedList;
};


// Delete List
// const deleteList = async (arg) => {
//   console.log(`c deleteList arg: ${JSON.stringify(arg)}`);
//   const { userId, listId } = arg;
//   return List.findOneAndDelete({ userId, _id: listId })
//     .then(async (result) => {
//       console.log(`c deleteList findOneAndDelete: ${JSON.stringify(result)}`);
//       // remove all items from DB that are only in this list
//       if (result !== null) {
//         const {items} = await List.findOne({ listId: result._id }).populate('items');
//         console.log(`c deleteList items by listId: ${JSON.stringify(items)}`);
//         // check all items in array
//         items.forEach((item) => {
//           //check if the list has only this one item
//           console.log(`c deleteList length(item.lists): ${length(item.lists)}`);
//           if(length(item.lists)==1 && item.lists[0]._id === listId )
//           { deleteItem(item._id, userId)};
//         });
//         // console.log(`c deleteList delItemByList: ${JSON.stringify(delItemByList)}`);
//       }
//       return result;
//     })
//     .catch((err) => console.error('Error db: ', err));
// };

// // Create Comment
// const createComment = async (arg) => {
//   console.log(`c createComment arg: ${JSON.stringify(arg)}`);
//   const comment = new Comment({
//     _id: arg.id, ...arg,
//   });
//   console.log(`c createComment comment: ${JSON.stringify(comment)}`);
//   return comment.save()
//     .then((result) => {
//       console.log(`c createComment SaveOne: ${JSON.stringify(result)}`);
//       const newComment = {
//         id: result._id,
//         userId: result.userId,
//         listId: result.postId,
//         content: result.content,
//         createdDate: result.createdDate,
//       };
//       console.log(`c createComment newComment: ${JSON.stringify(newComment)}`);
//       return newComment;
//     })
//     .catch((err) => console.error('Error db: ', err));
// };

// Delete Item
// const deleteComment = async (arg) => {
//   console.log(`c deleteComment arg: ${JSON.stringify(arg)}`);
//   const { id, userId } = arg;
//   return Comment.findOneAndDelete({ userId, _id: id })
//     .then((result) => {
//       console.log(`c deleteComment findByIdAndRemove: ${JSON.stringify(result)}`);
//       return result;
//     })
//     .catch((err) => console.error('Error db: ', err));
// };
const deleteItem = async (arg) => {
  console.log(`c deleteItem arg: ${JSON.stringify(arg)}`);
  const { id, userId } = arg;
  return Item.findOneAndDelete({ userId, _id: id })
    .then((result) => {
      console.log(`c deleteItem findOneAndDelete: ${JSON.stringify(result)}`);
      return result;
    })
    .catch((err) => console.error('Error db: ', err));
};

export {
  createUser, updatePassword, deleteUser, createList, updateItemInLists, removeItemFromList, updateItem, deleteItem,
};
