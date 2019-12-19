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
  createUser, updatePassword, deleteUser, createList, updateItemInLists, removeItemFromList, updateItem, deleteItem,
} from '../mongodb/controllersSet';

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
      const resList = await getList(id);
      console.log(`query list id: ${id}`);
      console.log(`query list resList: ${JSON.stringify(resList)}`);
      const itemsByList = await getItemsByList({ listId: resList.id });
      if (itemsByList.length !== 0) {
        // const average = itemsByList.reduce((total, item, index, array) => {
        //   total += item.userRating;
        //   return total / array.length;
        // }, 0);
        // resList.userAverageRating = average;
        const sumRating = itemsByList.reduce((sum, item) => sum + item.userRating, 0);
        resList.userAverageRating = sumRating / itemsByList.length;
      }
      console.log('q list itemsByList.length: ', itemsByList.length);
      return {
        ...resList,
        numberOfItems: itemsByList.length,
        items: itemsByList,
      };
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
      }).map(async (resList) => {
        const itemsByList = await getItemsByList({ listId: resList.id });
        // console.log('q lists itemsByList.length: ', itemsByList.length);
        if (itemsByList.length !== 0) {
          // const average = itemsByList.reduce((total, item, index, array) => {
          //   total += item.userRating;
          //   return total / array.length;
          // }, 0);
          // resList.userAverageRating = average;
          const sumRating = itemsByList.reduce((sum, item) => sum + item.userRating, 0);
          resList.userAverageRating = sumRating / itemsByList.length;
        }
        return {
          ...resList,
          numberOfItems: itemsByList.length,
          items: itemsByList,
        };
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
        console.log('q itemsByList sumRating: ', sumRating);
        console.log('q itemsByList itemsByList.length: ', itemsByList.length);
        console.log('q itemsByList sumRating / itemsByList.length: ', sumRating / itemsByList.length);
        const fullList = { ...resList };
        fullList.userAverageRating = sumRating === 0 ? 0 : sumRating / itemsByList.length;
        fullList.numberOfItems = itemsByList.length;
        fullList.items = itemsByList;
        // return {
        //   ...resList,
        //   numberOfItems: itemsByList.length,
        //   items: itemsByList,
        // };
        // console.log('q itemsByList resList.userAverageRating: ', resList.userAverageRating);
        console.log('q itemsByList fullList.items: ', fullList.items);
        console.log('q itemsByList fullList.userAverageRating: ', fullList.userAverageRating);
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
    itemsByUser: async (_, { id }) => getItemsByUser({ userId: id }),
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
      // data.append('file', files[0]);
      // data.append('upload_preset', 'sickfits');
      const resArray = [];
      const res = await fetch(url)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error('Bad response from server');
          }
          return response.json();
        }) // .then((response) => response.json())
        .then((result) => {
          console.log(`q searchItem fetch API result: ${JSON.stringify(result)}`);
          // console.log(`q searchItem fetch API result.Title: ${result.Title}`);
          return {
            imdbID: result.imdbID,
            title: result.Title,
            year: result.Year,
            rated: result.Rated,
            released: result.Released,
            genre: result.Genre,
            director: result.Director,
            actors: result.Actors,
            language: result.Language,
            plot: result.Plot,
            country: result.Country,
            imdbRating: result.imdbRating,
            imdbVotes: result.imdbVotes,
            type: result.Type,
          };
          // return result;
        })
        .catch((err) => console.error('Error API: ', err));
      resArray.push(res);
      console.log(`q searchItem fetch API resArray: ${resArray}`);
      // const temp = {
      //   title: 'Terminator', year: '1991', rated: 'N/A', released: 'N/A', genre: 'Short, Action, Sci-Fi', director: 'Ben Hernandez', Writer: 'James Cameron (characters), James Cameron (concept), Ben Hernandez (screenplay)', actors: 'Loris Basso, James Callahan, Debbie Medows, Michelle Kovach', plot: 'A cyborg comes from the future, to kill a girl named Sarah Lee.', language: 'English', country: 'USA', imdbRating: '6.2', imdbVotes: '25', imdbID: 'tt5817168', type: 'movie',
      // };
      // JSON.parse(temp);
      return resArray;
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
    updateItemInLists: async (_, {
      userId, listsId: lists, itemId, userRating,
    }, context) => {
      const { id } = context.user;
      if (id !== userId) {
        throw new Error('Вы не можете редактировать чужой список!');
      }
      const dataItemInLists = { itemId, lists, userRating };
      console.log(`m updateItemInLists dataItemInLists: ${JSON.stringify(dataItemInLists)}`);
      const updatedLists = await updateItemInLists(dataItemInLists);
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
      const dataItem = { itemId, userRating, comment };
      console.log(`m updateItem dataItem: ${JSON.stringify(dataItem)}`);
      const updatedItem = await updateItem(dataItem);
      return updatedItem;
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
