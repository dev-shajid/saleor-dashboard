
import { CustomerFilterInput } from "@dashboard/graphql";

import {
  createFilterUtils,
} from "../../../../utils/filters";
import {
  ReviewListUrlFilters,
  ReviewListUrlFiltersEnum,
  ReviewListUrlQueryParams,
} from "../../../urls";

export const CUSTOMER_FILTERS_KEY = "reviewsFilters";

export function getFilterOpts(
  params: ReviewListUrlFilters,
) {
  return {
    search: params.query || "",
  };
}

export function getFilterVariables(
  params: ReviewListUrlFilters,
): CustomerFilterInput {
  return {
    search: params.query,
  };
}



export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<ReviewListUrlQueryParams, ReviewListUrlFilters>(
    ReviewListUrlFiltersEnum,
  );
