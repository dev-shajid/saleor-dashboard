// @ts-strict-ignore
import { ReviewListUrlSortField } from "@dashboard/reviews/urls";
import { ReviewSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: ReviewListUrlSortField,
): ReviewSortField {
  switch (sort) {
    case ReviewListUrlSortField.updatedAt:
      return ReviewSortField.UPDATED_AT;
    case ReviewListUrlSortField.rating:
      return ReviewSortField.RATING;
    case ReviewListUrlSortField.status:
      return ReviewSortField.STATUS;
    case ReviewListUrlSortField.title:
      return ReviewSortField.TITLE;
    case ReviewListUrlSortField.user:
      return ReviewSortField.USER;
    case ReviewListUrlSortField.product:
      return ReviewSortField.PRODUCT;
    default:
      return ReviewSortField.UPDATED_AT;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
