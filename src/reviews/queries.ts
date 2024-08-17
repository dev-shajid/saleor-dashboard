import { gql } from "@apollo/client";


export const productListQuery = gql`
  query ProductList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: ProductFilterInput
    $search: String
    $where: ProductWhereInput
    $channel: String
    $sort: ProductOrder
    $hasChannel: Boolean!
    $includeCategories: Boolean!
    $includeCollections: Boolean!
  ) {
    products(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      search: $search
      where: $where
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          ...ProductWithChannelListings
          updatedAt
          description
          attributes {
            ...ProductListAttribute
          }
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const defaultGraphiQLQuery = `query ProductDetails($id: ID!) {
  product(id: $id) {
    id
    name
    slug
    description
  }
}`;
