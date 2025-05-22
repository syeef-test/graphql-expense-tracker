import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";
import cors from "cors"; // <-- added import for cors

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
import { configurePassport } from "./passport/passport.config.js";
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

  // Add CORS middleware
  // Enhanced CORS configuration
  // app.use(
  //   cors({
  //     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  //     credentials: true,
  //     methods: ["GET", "POST", "OPTIONS"],
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //   })
  // );

  // Allow all origins with credentials
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
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
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false, // <-- disable Apollo's built-in CORS, since we already used express cors
  });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  await connectDB();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(mergedTypeDefs, mergedResolvers);
