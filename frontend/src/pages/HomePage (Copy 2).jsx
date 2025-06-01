// src/pages/HomePage.jsx
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../store/authSlice";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_TRANSACTIONS_STATISTICS } from "../graphql/queries/transaction.queries";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";

const HomePage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [logout, { loading: logoutLoading, client }] = useMutation(LOGOUT);

  const { data, loading: transactionLoading } = useQuery(
    GET_TRANSACTIONS_STATISTICS,
    {
      skip: !authUser, // Skip query if not authenticated
    }
  );

  const handleLogout = async () => {
    try {
      // 1. Reset store BEFORE logout to clear active queries
      await client.resetStore();

      // 2. Perform logout mutation
      await logout();

      // 3. Update Redux state
      dispatch(logoutSuccess());

      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed", error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          {/* ... */}
          <img
            src={authUser?.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!logoutLoading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {logoutLoading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        {/* ... */}
      </div>
    </>
  );
};

export default HomePage;
