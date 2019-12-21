// import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fetch from 'cross-fetch';
import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} from 'graphql-iso-date';
import moment from 'moment';
import { User, List, Item } from '../mongodb/models';
import {
  getUsers, getUser, getUserByArg, getLists, getList, getListsByUser, getItemsByList, getItemsByUser, getDataByUser,
} from '../mongodb/controllersGet';
import {
  createUser, updatePassword, deleteUser, createList, updateList, removeItemFromList, updateItem, deleteItem,
} from '../mongodb/controllersSet';
import {
  getUserAverageRating, updateListByTypedef,
} from './lib';

require('dotenv').config({ path: 'variables.env' });

/* eslint no-underscore-dangle: [1, { "allow": ["__id"] }] */


// TO-DO: do request throw Promise for catch MongoDB error
const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    me: async (parent, arg, context, resolveInfo) => {
      // console.log('Query:  me -> ctx.request.userId', ctx.request.userId);
      // console.log('Query: me -> context', context);
      console.log(`query me ctx.user: ${JSON.stringify(context.user)}`);
      // console.log(`query me ctx.req: ${JSON.stringify(ctx.req)}`);
      // console.log(`query me ctx.request: ${JSON.stringify(ctx.request)}`);
      // check if there is a current userId in request
      if (!context.user) {
        return null;
      }
      const { id } = context.user;
      // TO-DO do request throw Promise for catch MongoDB error
      const user = await getUser(id);
      console.log(`query me getUser user: ${JSON.stringify(user)}`);
      if (!user) return null;
      // console.log(`query me req.user: ${JSON.stringify(context.req.user)}`);
      // const listsByUser = await getListsByUser({ userId: user.id });
      // const itemsByUser = await getItemsByUser({ userId: user.id });
      const dataByUser = await getDataByUser({ userId: user.id });
      return {
        ...user,
        numberOfLists: dataByUser.listsByUser.length,
        numberOfItems: dataByUser.itemsByUser.length,
      };
    },
    user: async (_, { id }) => {
      const result = await getUser(id);
      const dataByUser = await getDataByUser({ userId: result.id });
      return {
        ...result,
        ...dataByUser,
      };
    },
    users: async () => {
      const users = await getUsers();
      console.log(`q users result getUsers: ${JSON.stringify(users)}`);
      if (users === []) return users;
      const usersWithInfo = users.map(async (resUser) => {
        const dataByUser = await getDataByUser({ userId: resUser.id });
        console.log('q users numberOfLists.length: ', dataByUser.listsByUser.length);
        console.log('q users numberOfItems.length: ', dataByUser.itemsByUser.length);
        return {
          ...resUser,
          numberOfLists: dataByUser.listsByUser.length,
          numberOfItems: dataByUser.itemsByUser.length,
        };
      });
      return usersWithInfo;
    },
    list: async (_, { id }) => {
      const reqList = await getList(id);
      // change the result according to the type List
      const list = {
        id: reqList._id,
        title: reqList.title,
        userId: reqList.userId,
        description: reqList.description,
        items: reqList.items,
        // numberOfItems: reqList.numberOfItems,
        // numberOfItems: reqList.items.length,
        userAverageRating: reqList.userAverageRating,
        createdDate: reqList.createdDate,
      };
      console.log(`query list id: ${id}`);
      console.log(`query list List: ${JSON.stringify(list)}`);
      const itemsByList = await getItemsByList({ listId: list.id });
      // if (itemsByList.length !== 0) {
      // const average = itemsByList.reduce((total, item, index, array) => {
      //   total += item.userRating;
      //   return total / array.length;
      // }, 0);
      // reqList.userAverageRating = average;
      // const sumRating = itemsByList.reduce((sum, item) => sum + item.userRating, 0);
      // reqList.userAverageRating = sumRating / itemsByList.length;
      // check, if itemsByList.length = 0!
      // }
      const sumRating = itemsByList.length !== 0 ? itemsByList.reduce((sum, item) => sum + item.userRating, 0) : 0;
      // console.log('q itemsByList sumRating: ', sumRating);
      // console.log('q itemsByList itemsByList.length: ', itemsByList.length);
      // console.log('q itemsByList sumRating / itemsByList.length: ', sumRating / itemsByList.length);
      const fullList = { ...list };
      // check, if sumRating = 0!
      fullList.userAverageRating = sumRating === 0 ? 0 : sumRating / itemsByList.length;
      fullList.numberOfItems = itemsByList.length;
      fullList.items = itemsByList;
      console.log('q list fullList.numberOfItems: ', fullList.numberOfItems);
      // return {
      //   ...list,
      //   numberOfItems: itemsByList.length,
      //   items: itemsByList,
      // };
      return fullList;
    },
    lists: async () => {
      const lists = await getLists() || [];
      // console.log(`q lists result getLists: ${JSON.stringify(lists)}`);
      if (lists === []) return lists;
      // sort by createdDate
      console.log(`q lists result getLists: ${JSON.stringify(lists)}`);
      const sortLists = lists.sort((a, b) => {
        const res = b.createdDate - a.createdDate;
        // console.log(`q lists sort res b-a: ${res}`);
        return res;
      }).map(async (reqList) => {
        const itemsByList = await getItemsByList({ listId: reqList.id });
        // console.log('q lists itemsByList.length: ', itemsByList.length);
        // check, if itemsByList.length = 0!
        const sumRating = itemsByList.length !== 0 ? itemsByList.reduce((sum, item) => sum + item.userRating, 0) : 0;
        // console.log('q itemsByList sumRating: ', sumRating);
        // console.log('q lists: itemsByList itemsByList.length: ', itemsByList.length);
        // console.log('q itemsByList sumRating / itemsByList.length: ', sumRating / itemsByList.length);
        const fullList = { ...reqList };
        // check, if sumRating = 0!
        fullList.userAverageRating = sumRating === 0 ? 0 : sumRating / itemsByList.length;
        fullList.numberOfItems = itemsByList.length;
        console.log('q lists:  fullList.numberOfItems: ', fullList.numberOfItems);
        fullList.items = itemsByList;
        return fullList;
      });
      console.log('q lists sortLists: ', sortLists);
      return sortLists;
    },
    listsByUser: async (_, { id }) => {
      const result = await getListsByUser({ userId: id });
      // console.log('q listsByUser result: ', result);
      if (result === []) return result;
      const lists = result.sort((a, b) => {
        const res = b.createdDate - a.createdDate;
        // console.log(`q lists sort res b-a: ${res}`);
        return res;
      }).map(async (resList) => {
        const itemsByList = await getItemsByList({ listId: resList.id });
        // console.log('q lists itemsByList.length: ', itemsByList.length);
        // if (itemsByList.length !== 0) {
        //   const sumRating = itemsByList.reduce((sum, item) => sum + item.userRating, 0);
        //   resList.userAverageRating = sumRating / itemsByList.length;
        // }
        // check, if itemsByList.length = 0!
        const sumRating = itemsByList.length !== 0 ? itemsByList.reduce((sum, item) => sum + item.userRating, 0) : 0;
        // console.log('q itemsByList sumRating: ', sumRating);
        // console.log('q itemsByList itemsByList.length: ', itemsByList.length);
        // console.log('q itemsByList sumRating / itemsByList.length: ', sumRating / itemsByList.length);
        const fullList = { ...resList };
        fullList.userAverageRating = sumRating === 0 ? 0 : sumRating / itemsByList.length;
        fullList.numberOfItems = itemsByList.length;
        console.log('q listsByUser: fullList.numberOfItems: ', fullList.numberOfItems);
        fullList.items = itemsByList;
        // return {
        //   ...resList,
        //   numberOfItems: itemsByList.length,
        //   items: itemsByList,
        // };
        // console.log('q itemsByList resList.userAverageRating: ', resList.userAverageRating);
        // console.log('q itemsByList fullList.items: ', fullList.items);
        // console.log('q itemsByList fullList.userAverageRating: ', fullList.userAverageRating);
        return fullList;
      });
      // console.log('q listsByUser lists: ', lists);
      return lists;
    },

    //   commentsByList: async (_, { id }) => {
    //     const comments = await getCommentsByList({ listId: id });
    //     console.log(`q comments result getCommentsByList: ${JSON.stringify(comments)}`);
    //     if (comments === []) return comments;
    //     const sortCommens = comments.sort((a, b) => {
    //       // console.log(`q comments sort: ${JSON.stringify(a)}`);
    //       console.log(`q comments sort.createdDate a: ${a.createdDate}`);
    //       // console.log(`q comments sort: ${JSON.stringify(b)}`);
    //       console.log(`q comments sort.createdDate b: ${b.createdDate}`);
    //       const res = b.createdDate - a.createdDate;
    //       console.log(`q comments sort res b-a: ${res}`);
    //       return res;
    //     });
    //     return sortCommens;
    //   },
    //   commentsByUser: async (_, { id }) => getCommentsByUser({ userId: id }),
    // },
    itemsByList: async (_, { id }) => {
      const items = await getItemsByList({ listId: id });
      console.log(`q items getItemsByList: ${JSON.stringify(items)}`);
      if (items === []) return items;
      // sort by Rating
      const sortItems = items.sort((a, b) => {
      // console.log(`q items sort: ${JSON.stringify(a)}`);
        console.log(`q items sort.userRating a: ${a.userRating}`);
        // console.log(`q items sort: ${JSON.stringify(b)}`);
        console.log(`q items sort.userRating b: ${b.userRating}`);
        const res = b.userRating - a.userRating;
        console.log(`q items sort res b-a: ${res}`);
        return res;
      });
      return sortItems;
    },
    // commentsByUser: async (_, { id }) => getCommentsByUser({ userId: id }),
    itemsByUser: async (_, { id }) => {
      const ItemsByUser = await getItemsByUser({ userId: id });
      const ListsByUser = await getListsByUser({ userId: id });
      // console.log(`q itemsByUser ItemsByUser: ${JSON.stringify(ItemsByUser)}`);
      // console.log(`q itemsByUser ListsByUser: ${JSON.stringify(ListsByUser)}`);
      return ItemsByUser.map(async (item) => {
        const listArr = await item.lists.map((listOfItem) => ListsByUser.find((list) => listOfItem.toString() === list.id.toString()));
        const updItem = { ...item };
        updItem.lists = [...listArr];
        // console.log(`q itemsByUser updItem: ${JSON.stringify(updItem)}`);
        return updItem;
      });
    },
    searchItem: async (parent, arg, context, info) => {
      console.log(`q searchItem arg: ${JSON.stringify(arg)}`);
      const {
        title, imdbID, year, genre,
      } = arg;
      // http://www.omdbapi.com/?i=tt3896198&apikey=*******
      // http://www.omdbapi.com/?t=Game of Thrones&Season=1&Episode=1
      const apiKey = process.env.OMDB_KEY;
      const apiUrl = process.env.OMDB_URL;
      const reqParams = imdbID === '' ? `t=${title}` : `i=${imdbID}`;
      const url = `${apiUrl}?${reqParams}&apikey=${apiKey}`;
      console.log(`q searchItem url: ${url}`);
      // const resArray = [];
      const res = await fetch(url)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error('Bad response from server');
          }
          return response.json();
        })
        .then((result) => {
          console.log(`q searchItem fetch API SON.stringify.result: ${JSON.stringify(result)}`);
          if (result.Error) {
            throw new Error(result.Error);
          }

          return {
            imdbID: result.imdbID || '',
            title: result.Title || '',
            year: result.Year || '',
            rated: result.Rated || '',
            released: result.Released || '',
            genre: result.Genre || '',
            director: result.Director || '',
            actors: result.Actors || '',
            language: result.Language || '',
            plot: result.Plot || '',
            country: result.Country || '',
            imdbRating: result.imdbRating || '',
            imdbVotes: result.imdbVotes || '',
            type: result.Type || '',
          };
          // return result;
        })
        .catch((err) => {
          console.error('Error API: ', err);
          return err;
        });
      console.log(`q searchItem fetch API res: ${JSON.stringify(res)}`);
      return res;

      // resArray.push(res);
      // console.log(`q searchItem fetch API resArray: ${JSON.stringify(resArray)}`);
      // const temp = {
      //   title: 'Terminator', year: '1991', rated: 'N/A', released: 'N/A', genre: 'Short, Action, Sci-Fi', director: 'Ben Hernandez', Writer: 'James Cameron (characters), James Cameron (concept), Ben Hernandez (screenplay)', actors: 'Loris Basso, James Callahan, Debbie Medows, Michelle Kovach', plot: 'A cyborg comes from the future, to kill a girl named Sarah Lee.', language: 'English', country: 'USA', imdbRating: '6.2', imdbVotes: '25', imdbID: 'tt5817168', type: 'movie',
      // };
      // return resArray;
    },
  },

  Mutation: {
    signUp: async (_, { name, email, password }, context) => {
      // console.log(`m createUser context: ${JSON.stringify(context)}`);
      // console.log(`m createUser context: ${context.secret}`);
      // const id = uuidv4();
      const newUserData = {
        // id, name, email, password,
        name, email, password,
      };
      console.log(`m createUser dataNewUser: ${JSON.stringify(newUserData)}`);
      const user = await createUser(newUserData);
      // const expiresIn = '30m'; // '12h';
      // const jwtToken = await jwt.sign(newUser, context.secret, { expiresIn });
      const jToken = await jwt.sign(user, context.secret);
      // set the jwt as a cookie on the response
      context.res.cookie('token', jToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30, // Expiry - 30 min
      });
      // return { token: jToken };
      return user;
    },
    signIn: async (_, { email, password }, context) => {
      // console.log(`m signIn context.res: ${context.res[0]}`);
      // console.log(`m signIn context.req.user: ${JSON.stringify(context.req.user)}`);
      // console.log(`m signIn context: ${context.secret}`);
      const AuthArg = ['email', email];
      // console.log(`m signIn AuthArg: ${JSON.stringify(AuthArg)}`);
      const user = await getUserByArg(AuthArg);
      console.log(`m signIn user: ${JSON.stringify(user)}`);
      if (!user) {
        throw new Error(
          'Пользователя с таким email не существует!',
        );
      }
      const isValidPass = await bcrypt.compare(password, user.password);
      // console.log(`m signIn isValidPass: ${isValidPass}`);
      if (!isValidPass) {
        throw new Error(
          'Неверный пароль! Попробуйте еще раз.',
        );
      }
      delete user.password;
      // const expiresIn = '30m'; // '12h';
      // const jToken = await jwt.sign(user, context.secret, { expiresIn });
      const jToken = jwt.sign(user, context.secret);
      // console.log(`m signIn jToken: ${JSON.stringify(jToken)}`);
      // if (!context.response.cookie) context.response.cookie = {};
      // context.response.cookie('token', jToken, {
      context.res.cookie('token', jToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 31, // Expiry - 1 year
      });
      console.log(`m signIn cookie context.res: ${context.res}`);
      // console.log(`m signIn context.req: ${JSON.stringify(context.req)}`);
      // return { token: jToken };
      return user;
    },
    signOut: async (_, args, context) => {
      // console.log(`m signOut args: ${JSON.stringify(args)}`);
      context.res.clearCookie('token');
      // console.log(`m signOut cookie context.res: ${context.res}`);
      return { message: 'success' };
    },
    updatePassword: async (_, { password }, context) => {
      // console.log(`m updatePassword context.res: ${context.res[0]}`);
      // console.log(`m updatePassword context.req.user: ${JSON.stringify(context.req.user)}`);
      // console.log(`m updatePassword context: ${context.secret}`);
      if (!context.user) {
        return null;
      }
      const { id } = context.user;
      const user = await getUser(id);
      // console.log(`m updatePassword getUser user: ${JSON.stringify(user)}`);
      if (!user) {
        throw new Error(
          'Пользователя не существует!',
        );
      }
      const isValidPass = await bcrypt.compare(password, user.password);
      // console.log(`m updatePassword isValidPass: ${isValidPass}`);
      if (!isValidPass) {
        throw new Error(
          'Неверный пароль! Попробуйте еще раз.',
        );
      }
      const newUserData = {
        id, password,
      };
      const updatedUser = await updatePassword(newUserData);
      // const expiresIn = '30m'; // '12h';
      // const jToken = await jwt.sign(user, context.secret, { expiresIn });
      const jToken = jwt.sign(updatedUser, context.secret);
      // console.log(`m updatePassword jToken: ${JSON.stringify(jToken)}`);
      context.res.cookie('token', jToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 31, // Expiry - 1 year
      });
      console.log(`m updatePassword cookie context.res: ${context.res}`);
      // console.log(`m updatePassword context.req: ${JSON.stringify(context.req)}`);
      // return { token: jToken };
      return updatedUser;
    },
    deleteUser: async (_, arg, context) => {
      // console.log(`m deleteUser arg: ${JSON.stringify(arg)}`);
      // console.log(`m deleteUser context.secret: ${context.secret}`);
      // console.log(`m deleteUser context.user: ${JSON.stringify(context.user)}`);
      // console.log(`m deleteUser context.user.id: ${context.user.id}`);
      if (!context.user) {
        return null;
      }
      const { userId: id, password } = arg;
      // TO-DO do request throw Promise for catch MongoDB error
      const AuthArg = ['_id', id];
      // console.log(`m signIn AuthArg: ${JSON.stringify(AuthArg)}`);
      const user = await getUserByArg(AuthArg);
      console.log(`m deleteUser getUser user: ${JSON.stringify(user)}`);
      if (!user) {
        throw new Error(
          'Пользователя не существует!',
        );
      }
      const isValidPass = await bcrypt.compare(password, user.password);
      // console.log(`m deleteUser isValidPass: ${isValidPass}`);
      if (!isValidPass) {
        throw new Error(
          'Неверный пароль! Попробуйте еще раз.',
        );
      }
      const delUser = await deleteUser(id);
      console.log(`m deleteUser delUser: ${JSON.stringify(delUser)}`);
      if (!delUser) {
        throw new Error(
          'Ошибка при удалении аккаунта!',
        );
      }
      if (delUser) {
        context.res.clearCookie('token');
        console.log(`m deleteUser clearCookie context.res: ${context.res}`);
        return { message: 'Success' };
      }
    },
    createList: async (_, {
      userId, title, description,
    }) => {
      // const id = uuidv4();
      // const createdDate = new Date().toISOString;
      const createdDate = moment.utc().format();
      console.log(`m createList createdDate: ${createdDate}`);
      const newListData = {
        title, userId, description, createdDate,
      };
      console.log(`m createList newListData: ${JSON.stringify(newListData)}`);
      const newList = await createList(newListData);
      console.log(`m createList newList: ${JSON.stringify(newList)}`);
      return newList;
    },
    // add and remove Item, update UserRating in Lists
    updateItemInLists: async (_, arg, context) => {
      // const {
      //   userId, lists, itemId, userRating,
      // } = arg;
      console.log(`m updateItemInLists arg: ${JSON.stringify(arg)}`);
      const { id } = context.user;
      // console.log(`m updateItemInLists userId: ${userId}`);
      // console.log(`m updateItemInLists id: ${id}`);
      // console.log('m updateItemInLists id !== arg.userId: ', id.toString() !== arg.userId.toString());
      if (id.toString() !== arg.userId.toString()) {
        throw new Error('Вы не можете редактировать чужой список!');
      }
      // update the array lists according to the type Item
      // const updArg = { ...arg };
      // updArg.lists = arg.lists.map((list) => ({ _id: list.listId }));
      const listIdArr = arg.lists.map((list) => ({ _id: list.listId }));
      console.log(`m updateItemInLists listIdArr: ${JSON.stringify(listIdArr)}`);
      const {
        itemId, userId, userRating, title, yearOfRelease, genre,
      } = arg;
      const dataItem = {
        itemId, userId, lists: listIdArr, userRating, title, yearOfRelease, genre,
      };
      console.log(`m updateItemInLists dataItem: ${JSON.stringify(dataItem)}`);
      // //const updatedLists = await updateItemInLists(dataItemInLists);
      console.log(`m updateItemInLists 1: ${1}`);
      // 1. update Item: new Array lists, userRating
      // if the Item is not in the database, then add it
      const updatedItem = await updateItem(dataItem);
      if (updatedItem === null) throw new Error('Error db: error when updating Item');
      console.log(`m updateItemInLists updatedItem: ${JSON.stringify(updatedItem)}`);
      console.log(`m updateItemInLists 2: ${2}`);
      // 2. update all lists in the Item's array
      // iterate all lists in array
      const updatedLists = await arg.lists.map(async (list) => {
        // update each list in array: add item to Items array
        // a) get the List by ID
        console.log(`m updateItemInLists 2a: ${'2a'}`);
        const reqList = await getList(list.listId);
        console.log(`m updateItemInLists reqList: ${JSON.stringify(reqList)}`);
        // update the array items according to the type List
        const itemIdArr = reqList.items.map((item) => ({ _id: item }));
        console.log(`m updateItemInLists itemIdArr: ${JSON.stringify(itemIdArr)}`);
        console.log(`m updateItemInLists 2b: ${'2b'}`);
        // b) update the array items: push new Item,
        // check for new Item not in the array, then push new Item
        if (!reqList.items.includes(itemId)) {
          itemIdArr.push({ _id: itemId });
          console.log(`m updateItemInLists itemIdArr After Push: ${JSON.stringify(itemIdArr)}`);
        }
        console.log(`m updateItemInLists 2c: ${'2c'}`);
        // c) update property values: items, numberOfItems, userAverageRating
        //  get all items by list ID
        const itemsByList = await getItemsByList({ listId: list.listId });
        console.log(`m updateItemInLists itemsByList: ${JSON.stringify(itemsByList)}`);
        // const listsArr = updatedItem.lists.map((el) => ({ id: el }));
        // console.log(`m updateItemInLists listsArr: ${JSON.stringify(listsArr)}`);
        const updItem = {
          id: updatedItem._id,
          userId: updatedItem.userId,
          lists: updatedItem.lists.map((el) => ({ id: el })),
          title: updatedItem.title,
          yearOfRelease: updatedItem.yearOfRelease,
          genre: updatedItem.genre,
          plotShort: updatedItem.plotShort,
          userRating: updatedItem.userRating,
          comment: updatedItem.comment,
          createdDate: updatedItem.createdDate,
        };
        // itemsByList.push(updItem);
        const itemsByListUpd = itemsByList.map((item) => {
          if (item.id === updatedItem._id) {
            return updItem;
          }
          return item;
        });
        console.log(`m updateItemInLists itemsByListUpd After MAP: ${JSON.stringify(itemsByListUpd)}`);
        // get property userAverageRating
        const userAverageRating = getUserAverageRating(itemsByListUpd);
        console.log('m updateItemInLists: updatedLists getUserAverageRating: ', userAverageRating);
        console.log(`m updateItemInLists 2d: ${'2d'}`);
        // d) set all new values in one object
        const dataList = {
          listId: list.listId, items: itemIdArr, userAverageRating, numberOfItems: itemsByListUpd.length,
        };
        console.log('m updateItemInLists: updatedLists dataList: ', dataList);
        console.log(`m updateItemInLists 2e: ${'2e'}`);
        // e) call function to update the List
        const updList = await updateList(dataList);
        // const listItemsArr = updList.items.map((el) => ({ id: el }));
        // console.log(`m updateItemInLists:  updList listItemsArr: ${JSON.stringify(listItemsArr)}`);

        const newUpdList = updateListByTypedef(updList);
        // newUpdList.items = listItemsArr;
        console.log(`m updateItemInLists:  newUpdList: ${JSON.stringify(newUpdList)}`);
        return newUpdList;
      });
      console.log(`c updateItemInLists updatedLists result: ${JSON.stringify(updatedLists)}`);
      return updatedLists;
    },
    // remove Item from List
    removeItemFromList: async (_, { userId, listId, itemId }, context) => {
      const { id } = context.user;
      if (id !== userId) {
        throw new Error('Вы не можете редактировать чужой список!');
      }
      const dataRemoveItem = { itemId, listId };
      console.log(`m removeItemFromList dataRemoveItem: ${JSON.stringify(dataRemoveItem)}`);
      const updatedList = await removeItemFromList(dataRemoveItem);
      return updatedList;
    },
    // update userRating, comment for Item
    updateItem: async (_, {
      userId, itemId, userRating, comment,
    }, context) => {
      const { id } = context.user;
      if (id !== userId) {
        throw new Error('Вы не можете редактировать элементы из чужого списка!');
      }
      // console.log(`m updateItem lists: ${lists}`);
      const dataItem = {
        itemId, userId, userRating, comment,
      };
      console.log(`m updateItem dataItem: ${JSON.stringify(dataItem)}`);
      const updatedItem = await updateItem(dataItem);
      if (updatedItem === null) throw new Error('Error db: error when updating Item');

      // change the result according to the type Item
      // update the array lists according to the type Item
      const listsArr = updatedItem.lists.map((list) => ({ id: list }));
      const updItem = {
        id: updatedItem._id,
        lists: listsArr,
        title: updatedItem.title,
        yearOfRelease: updatedItem.yearOfRelease,
        genre: updatedItem.genre,
        plotShort: updatedItem.plotShort,
        userRating: updatedItem.userRating,
        comment: updatedItem.comment,
        userId: updatedItem.userId,
        createdDate: updatedItem.createdDate,
      };
      return updItem;
    },
    // deleteList: async (_, { listId, userId }) => {
    //   console.log(`m deleteList listId: ${listId}, userId: ${userId} `);
    //   const delList = await deleteList({ userId, listId });
    //   console.log(`m deleteList delList: ${JSON.stringify(delList)}`);
    //   if (delList !== null) {
    //     return { message: 'Success' };
    //   }
    //   throw new Error('Вы не можете удалять чужие списки!');
    // },
    deleteItem: async (_, { itemId, userId }) => {
      console.log(`m deleteItem itemId: ${itemId}, userId: ${userId} `);
      const delItem = await deleteItem({ userId, itemId });
      console.log(`m deleteItem delItem: ${JSON.stringify(delItem)}`);
      if (delItem !== null) {
        return { message: 'Success' };
      }
      throw new Error('Вы не можете удалять элементы из чужого списка!');
    },
    // createComment: async (_, {
    //   userId, listId, content,
    // }) => {
    //   // const createdDate = new Date().toISOString;
    //   const createdDate = moment.utc().format();
    //   console.log(`m createPost createdDate: ${createdDate}`);
    //   const newComment = {
    //     userId, listId, content, createdDate,
    //   };
    //   return createComment(newComment);
    // },
    // createComment: async (_, {
    //   userId, itemId, content,
    // }) => {
    //   const createdDate = moment.utc().format();
    //   console.log(`m createComment createdDate: ${createdDate}`);
    //   const newComment = {
    //     userId, itemId, content, createdDate,
    //   };
    //   return createComment(newComment);
    // },
    // deleteComment: async (_, { id, userId }) => {
    //   // console.log(`m deleteComment id: ${JSON.stringify(id)}`);
    //   const delComment = await deleteComment({ id, userId });
    //   console.log(`m deleteComment delComment: ${JSON.stringify(delComment)}`);
    //   if (delComment !== null) {
    //     return { message: 'Success' };
    //   }
    //   throw new Error('Вы не можете удалять чужие комментарии!');
    // },
  },

};


export default resolvers;
