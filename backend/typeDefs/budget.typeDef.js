const budgetTypeDef = `#graphql
  scalar Date

  type Budget {
    _id: ID!
    amount: Float!
    fromdate: Date!
    todate: Date!
    status: String
    threshold:Float!
    user:User!
    userId: ID!
    currentSpending: Float!
  }

  type Query {
    getBudgets: [Budget!]!  
  }

  type Mutation {
    setBudget(input: BudgetInput!): Budget
  }

  input BudgetInput {
    amount: Float!
    fromdate: Date!
    todate: Date!
    threshold:Float!
  }
`;

export default budgetTypeDef;
