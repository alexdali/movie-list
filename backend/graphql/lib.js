import { User, List, Item } from '../mongodb/models';
import {
  getUsers, getUser, getUserByArg, getLists, getList, getListsByUser, getItemsByList, getItemsByUser, getDataByUser,
} from '../mongodb/controllersGet';
import {
  createUser, updatePassword, deleteUser, createList, updateList, updateItemInLists, removeItemFromList, updateItem, deleteItem,
} from '../mongodb/controllersSet';

const getUserAverageRating = (itemArr) => {
  // check, if itemsByList.length = 0!
  const sumRating = itemArr.length !== 0 ? itemArr.reduce((sum, item) => sum + item.userRating, 0) : 0;
  // check, if sumRating = 0!
  const userAverageRating = sumRating === 0 ? 0 : sumRating / itemArr.length;
  return userAverageRating;
};

// Update List by typedef
const updateListByTypedef = async (list) => {
  console.log(`lib updateListByType list: ${JSON.stringify(list)}`);
  const numberOfItems = list.items.length !== 0 ? list.items.length : 0;
  const listItemsArr = list.items.map((el) => ({ id: el }));

  const updatedList = {
    id: list._id,
    title: list.title,
    userId: list.userId,
    description: list.description,
    items: listItemsArr,
    numberOfItems,
    userAverageRating: list.userAverageRating,
    createdDate: list.createdDate,
  };
  console.log(`lib updateListByType updatedList: ${JSON.stringify(updatedList)}`);
  return updatedList;
};

const updateItemByTypedef = async (item) => {
  console.log(`lib updateItemByTypedef item: ${JSON.stringify(item)}`);
  const itemListsArr = item.lists.map((el) => ({ id: el }));

  const updatedItem = {
    id: item.id,
    userId: item.userId,
    lists: itemListsArr,
    title: item.title,
    yearOfRelease: item.yearOfRelease,
    genre: item.genre,
    // plotShort: item.plotShort,
    userRating: item.userRating,
    // comment: item.comment,
    createdDate: item.createdDate,
  };
  console.log(`lib updateItemByTypedef updatedItem: ${JSON.stringify(updatedItem)}`);
  return updatedItem;
};


export {
  getUserAverageRating, updateListByTypedef, updateItemByTypedef,
};
