import { gql } from "@apollo/client";
import { Exact, Scalars } from "@dashboard/graphql";
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;

export enum ReviewSortField {
  title = "title",
  user = "user",
  product = "product",
  rating = "rating",
  status = "status",
  updatedAt = "updatedAt",
}

export const ProductReviewsDocument = gql`
    query ProductReviews{
      getProductReviews {
        id
        product{
          id
          name
          media{
            url
          }
        }
        rating
        review
        status
        title
        user{
          id
          email
          firstName
          lastName
        }
        createdAt
        updatedAt
        media{
          url
        }
      }
}
`;

export function useProductReviewsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ProductReviewsQuery, ProductReviewsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ProductReviewsQuery, ProductReviewsQueryVariables>(ProductReviewsDocument, options);
}

export type ProductReviewsQueryVariables = Exact<{}>;


export type ProductReviewsQuery = {
  getProductReviews: {
    id: string,
    media: { url: string, type: string | null, alt: string | null }[],
    product: { id: string, name: string, media: { url: string | null }[], },
    review: string, status: boolean, title: string, user: { id: string, email: string, firstName: string, lastName: string }, createdAt: string, updatedAt: string, rating: number
  }[] | null
};







// Query Review Details

export const ReviewDetailsDocument = gql`
    query ReviewDetails($id: ID!) {
      getProductReview(id:$id) {
        id
        product{
          id
          name
          media{
            url
          }
        }
        rating
        review
        status
        title
        user{
          id
          email
          firstName
          lastName
        }
        createdAt
        updatedAt
        media{
          url
          alt
          type
        }
      }
}
`;



export function useReviewDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ReviewDetailsQuery, ReviewDetailsQueryVariables>) {
  const options = {...defaultOptions, ...baseOptions}
  return ApolloReactHooks.useQuery<ReviewDetailsQuery, ReviewDetailsQueryVariables>(ReviewDetailsDocument, options);
}


export type ReviewDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ReviewDetailsQuery = {
  getProductReview: {
    id: string,
    media:{url:string, type:string | null, alt:string | null}[], 
    product: { id:string, name: string, media: { url: string | null }[], }, 
    user: { id:string, email: string, firstName: string, lastName: string }, 
    review: string, status: boolean, title: string, 
    createdAt: string, updatedAt: string, rating: number
  } | null
};