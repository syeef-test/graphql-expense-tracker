import { gql } from "@apollo/client";

export const BUDGET = gql`
  mutation Budget($input: BudgetInput!) {
    budget(input: $input) {
      _id
      amount
      fromdate
      todate
      threshold
    }
  }
`;
