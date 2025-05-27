import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.queries";
import {
  GET_USER_AND_TRANSACTIONS,
  GET_AUTHENTICATED_USER,
} from "../graphql/queries/user.queries";

const Cards = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);

  const { data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS, {
    variables: {
      userId: authUser?.authUser?._id,
    },
  });
  console.log("Authenticated User", authUser.authUser._id);
  console.log("User and Transactions Data", userAndTransactions);

  // if (error) return <p>Error: {error.message}</p>;
  // if (loading) return <p>Loading...</p>;

  //console.log("Cards data", data);

  //TODO => ADD RELATIONSHIPS
  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!loading &&
          data.transactions.map((transaction) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              authUser={authUser?.authUser}
            />
          ))}
      </div>
      {!loading && data?.transactions?.length === 0 && (
        <p className="text-2xl font-bold text-center w-full">
          No transactions found
        </p>
      )}
    </div>
  );
};
export default Cards;
