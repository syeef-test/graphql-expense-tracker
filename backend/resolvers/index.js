import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolver.js";
import transactionResolver from "./transaction.resolver.js";
import budgetResolver from "./budget.resolver.js";
const mergedResolvers = mergeResolvers([
  userResolver,
  transactionResolver,
  budgetResolver,
]);

export default mergedResolvers;
