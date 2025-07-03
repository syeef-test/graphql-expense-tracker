import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/Signup";
import TransactionPage from "./pages/TransactionPage";
import Budget from "./pages/BudgetPage.jsx";
import NotFound from "./pages/NotFound";
import Header from "./components/ui/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.queries.js";
import { Toaster } from "react-hot-toast";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setLoading } from "./store/authSlice";

function App() {
  //const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
  // console.log("data", data);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const { loading } = useQuery(GET_AUTHENTICATED_USER, {
    onCompleted: (data) => {
      if (data?.authUser) {
        dispatch(setAuthUser(data.authUser));
      }
    },
    onError: (error) => {
      console.error("Error fetching authenticated user:", error);
    },
    skip: !authUser, // Skip if user is already in state
  });

  useEffect(() => {
    if (loading) {
      dispatch(setLoading());
    }
  }, [loading, dispatch]);

  if (loading) return null;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={authUser ? <TransactionPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/budget"
          element={authUser ? <Budget /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
