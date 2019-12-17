import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
// import schema, { graphql } from "./schema";
// import graphql from 'graphql';
// import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-express';
// import bodyParser from 'body-parser';
import typeDefs from './graphql/typedef';
import resolvers from './graphql/resolvers';
//import uri from './mongodb/db';
import connectDBwithRetry from './mongodb/connectionDB';
import { getUser } from './mongodb/controllersGet';

require('dotenv').config({ path: 'variables.env' });

// mongoose.connect(uri, {
//   useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
// });
//
//
// mongoose.connection.once('open', () => {
//   console.log('connected to MongoDB');
// }).catch((err) => console.error('error MongoDb', err));

connectDBwithRetry();

// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// const server = new ApolloServer({
//   introspection: true,
//   // schema,
//   typeDefs,
//   resolvers,
//   formatError: (error) => error,
//   context: ({ req, res }) =>
//     // const user = await getMe(req);
//     // req.user = user;
//     // if (!res.cookie) res.cookie = {};
//     ({
//       ...req,
//       res,
//       secret: process.env.SECRET,
//     })
//   ,
// });


// create server
const app = express();
const port = process.env.PORT || 8888;

const corsOptions = {
  // origin: 'http://localhost:3333',
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// cors
app.use(cors(corsOptions));
app.use(cookieParser());

const getMe = async (req) => {
  // const token = req.headers['x-token'];
  const { token } = req.cookies;
  // console.log(`app.use req.cookies: ${JSON.stringify(req.cookies)}`);
  if (!token) return null;
  // try {
  //   return await jwt.verify(token, process.env.SECRET);
  // } catch (e) {
  //   throw new AuthenticationError(
  //     'Your session expired. Sign in again.',
  //   );
  // }
  // const user = jwt.verify(token, process.env.SECRET, (err, decoded) =>
  // // console.log(decoded); // bar
  //   ({ id: decoded.id, name: decoded.name, email: decoded.email }));
  // console.log(`app.use getMe user: ${JSON.stringify(user)}`);


  const userId = jwt.verify(token, process.env.SECRET, (err, decoded) => decoded.id);
  console.log(`app.use getMe userId: ${userId}`);

  const user = await getUser(userId);
  console.log(`app.use getMe MongoDB user: ${JSON.stringify(user)}`);
  // put the userId onto the req for future requests to access
  // req.userId = id;
  // req.user = { ...user };
  return user;
};

// app.use((req, res, next) => {
//   console.log(`app.use2 req.user: ${JSON.stringify(req.user)}`);
//   req,
//   res,
//   next();
// });

const server = new ApolloServer({
  introspection: true,
  // schema,
  typeDefs,
  resolvers,
  formatError: (error) => error,
  context: async ({ req, res }) => {
    const user = await getMe(req);
    req.user = user;
    console.log(`app.use ApolloServer req.user: ${JSON.stringify(req.user)}`);
    // console.log(`app.use2 server.context.req: ${JSON.stringify(context.req)}`);
    // if (!res.cookie) res.cookie = {};
    return {
      ...req,
      res,
      secret: process.env.SECRET,
    };
  }
  ,
},
() => {
  console.log(`app.use2 server.context.req: ${JSON.stringify(server.context.req)}`);
});

// app.use((req, res, next) => {
//   console.log(`app.use2 req.user: ${JSON.stringify(req.user)}`);
//   next();
// });


// The GraphQL endpoint
// server.applyMiddleware({
//   app,
//   path: '/',
//   cors: false, // disables the apollo-server-express cors to allow the cors middleware use
// });
server.applyMiddleware({
  app,
  path: '/',
  cors: false, // disables the apollo-server-express cors to allow the cors middleware use
},
() => {
  console.log(`app.use2 server.context.req: ${JSON.stringify(server.context.req)}`);

  app.use((req, res, next) => {
    console.log(`app.use3 req.user: ${JSON.stringify(req.user)}`);
    next();
  });
});


// server.applyMiddleware({ app });

// GraphiQL, a visual editor for queries
// server.applyMiddleware({ app, path: '/graphql' });


// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
// server.applyMiddleware({ app, path: '/' });

app.listen(port, () => {
  console.log(`app server listening on port: ${port}`);
});
