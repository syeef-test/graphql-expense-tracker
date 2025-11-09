import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { store } from "./store/store";
import { Provider } from "react-redux";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";//

if (process.env.NODE_ENV !== "production") {//
  loadDevMessages();
  loadErrorMessages();
}


const client = new ApolloClient({
  //TODO =>Update the uri on production server
  uri: "http://127.0.0.1:4000/graphql", // The URL of the GraphQL backend server
  cache: new InMemoryCache(), // Apollo client uses to cache query results after fetching them
  credentials: "include", //This tells Apollo Client to include cookies in every requests
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GridBackground>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </GridBackground>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
