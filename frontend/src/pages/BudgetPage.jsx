import { useState } from "react";
import { Link } from "react-router-dom";
import RadioButton from "../components/RadioButton";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import { BUDGET } from "../graphql/mutations/budget.mutation";
import toast from "react-hot-toast";

const BudgetPage = () => {
  const [budgetData, setBudgetData] = useState({
    amount: "",
    fromdate: "",
    todate: "",
    threshold: "",
  });

  const [budget, { loading, error }] = useMutation(BUDGET, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await budget({ variables: { input: budgetData } });
      await budget({
        variables: {
          input: {
            ...budgetData,
            amount: parseFloat(budgetData.amount),
            threshold: parseFloat(budgetData.threshold),
          },
        },
      });
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error(`Error creating budget: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setBudgetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Create Budget
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Create your budget to keep track of your expenses
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Amount"
                id="amount"
                name="amount"
                type="number"
                value={budgetData.amount}
                onChange={handleChange}
              />
              <InputField
                label="From Date"
                id="fromdate"
                name="fromdate"
                type="date"
                value={budgetData.fromdate}
                onChange={handleChange}
              />
              <InputField
                label="To Date"
                id="todate"
                name="todate"
                type="date"
                value={budgetData.todate}
                onChange={handleChange}
              />
              <InputField
                label="Threshold"
                id="threshold"
                name="threshold"
                type="number"
                value={budgetData.threshold}
                onChange={handleChange}
              />
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "CreateBudget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
