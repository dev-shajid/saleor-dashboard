// @ts-strict-ignore
import { ReviewSortField } from "@dashboard/reviews/graphql";
import { ReviewListUrlFilters, ReviewListUrlSortField } from "@dashboard/reviews/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(sort: ReviewListUrlSortField): ReviewSortField {
  if (ReviewListUrlSortField?.[sort]) return ReviewSortField[sort]
  else return undefined
}

export function getFilterVariables(params: ReviewListUrlFilters): { search: string } {
  return {
    search: params.query,
  };
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
