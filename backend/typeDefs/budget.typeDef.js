const budgetTypeDef = `#graphql
  scalar Date

  type Budget {
    _id: ID!
    amount: Float!
    fromdate: Date!
    todate: Date!
    status: String
    threshold:Float!
  }

  type Query {
    budgets: [Budget]  # You can define some query here
  }

  type Mutation {
    budget(input: BudgetInput!): Budget
  }

  input BudgetInput {
    amount: Float!
    fromdate: Date!
    todate: Date!
    threshold:Float!
  }
`;

export default budgetTypeDef;
