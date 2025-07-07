import Budget from "../models/budget.model.js";

const budgetResolver = {
  Mutation: {
    setBudget: async (_, { input }, context) => {
      try {
        const { amount, fromdate, todate, threshold } = input;
        //console.log("input", input);
        if (!amount || !fromdate || !todate || !threshold) {
          throw new Error("All fields are required");
        }

        const existingBudget = await Budget.findOne({
          userId: context.getUser()._id,
        });
        if (existingBudget) {
          throw new Error("Budget for this user already exists");
        }

        const newBudget = new Budget({
          amount,
          fromdate,
          todate,
          threshold,
          userId: context.getUser()._id,
        });

        await newBudget.save();
        return newBudget;
      } catch (error) {
        console.log("Error in budget:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default budgetResolver;
