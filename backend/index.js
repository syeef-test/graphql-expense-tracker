import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import { connectDB } from "./db/connectDB.js";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import configurePassport from "./passport/passport.config.js";
configurePassport();

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const MongoDBStore = connectMongo(session);

  const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

  store.on("error", (err) => {
    console.log(err);
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false, // this option specifies whether to save the session to the store on every request
      saveUninitialized: false, //option specifies whether to save uninitialized sessions to the store
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
        httpOnly: true, // this option prevents the cross-site scripting attacks
      },
      store: store,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ req, res }) => buildContext({ req, res }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app, path: "/" });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  await connectDB();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(mergedTypeDefs, mergedResolvers);
