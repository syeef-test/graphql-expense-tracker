import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import Budget from "../models/budget.model.js";

const transactionResolver = {
  Query: {
    transactions: async (parent, args, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error geting transaction:", error);
        throw new Error("Error geting transaction:");
      }
    },
    //Todo add category statistics query
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = await context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        //console.log("Creating transaction with input:", input);
        const userId = context.getUser()._id;
        const newTransaction = new Transaction({
          ...input,
          userId: userId,
        });
        await newTransaction.save();

        

        // Update budget if it's an expense
        if (newTransaction.amount > 0 && newTransaction.category === "expense") { 
          const budget = await Budget.findOne({ 
            userId: userId, 
            status: "active" 
          });

          if (budget) {
            budget.currentSpending += newTransaction.amount;
            await budget.save();
            
            if (budget.currentSpending >= ((budget.threshold/100) * budget.amount)) {
              console.log("budget limit crossed",budget, userId);
            }

          } else {
            console.warn("No active budget found for user:", userId);
          }
        }

        return newTransaction;
      } catch (error) {
        console.error("Error creating transaction:", error);
        throw new Error("Failed to create transaction");
      }
    },
    updateTransaction: async (_, { input },context) => {
      try {
       const userId = context.getUser()._id;
        const oldTransaction = await Transaction.findById(input.transactionId);
        
        // Update the transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );

        
        if (oldTransaction && updatedTransaction) {
          const budget = await Budget.findOne({
            userId: userId,
            status: "active"
          });

          if (budget) {
            
            if (oldTransaction.category === "expense" && oldTransaction.amount > 0) {
              budget.currentSpending -= oldTransaction.amount;
            }

           
            if (updatedTransaction.category === "expense" && updatedTransaction.amount > 0) {
              budget.currentSpending += updatedTransaction.amount;
            }

            await budget.save();

            
            if (budget.currentSpending >= ((budget.threshold/100) * budget.amount)) {
              console.log("Budget limit crossed after update", budget, userId);
            }
          }
        }

        return updatedTransaction;
      } catch (error) {
        console.error("Error updating transaction:", error);
        throw new Error("Failed to update transaction");
      }
    },
    deleteTransaction: async (_, { transactionId },context) => {
      try {
        const userId = context.getUser()._id;
        const deletedTransaction = await Transaction.findById(transactionId);

        if (!deletedTransaction) {
          throw new Error("Transaction not found");
        }

        
        await Transaction.findByIdAndDelete(transactionId);

        
        if (deletedTransaction.category === "expense" && deletedTransaction.amount > 0) {
          const budget = await Budget.findOne({
            userId: userId,
            status: "active"
          });

          if (budget) {
            budget.currentSpending -= deletedTransaction.amount;
            await budget.save();

            console.log(`Budget adjusted by -${deletedTransaction.amount} after deletion`);
          }
        }

        return deletedTransaction;
      } catch (error) {
        console.error("Error deleting transaction:", error);
        throw new Error("Failed to delete transaction");
      }
    },
    //Todo add transaction/user relationship
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error getting user:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
