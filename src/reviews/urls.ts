import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";

export const reviewsSection = "/reviews/";

export const reviewListPath = reviewsSection;
export type ReviewListUrlDialog =
  | "publish"
  | "unpublish"
  | "remove"
  | "create-review"
  | TabActionDialog;
export enum ReviewListUrlSortField {
  title = "title",
  user = "user",
  product = "product",
  rating = "rating",
  status = "status",
  updatedAt = "updatedAt",
}

export enum ReviewListUrlFiltersEnum {
  query = "query",
}

export type ReviewListUrlFilters = Filters<ReviewListUrlFiltersEnum>

export type ReviewListUrlSort = Sort<ReviewListUrlSortField>;
export type ReviewListUrlQueryParams =
  ReviewListUrlFilters &
  Pagination &
  ReviewListUrlSort;
export const reviewListUrl = (params?: ReviewListUrlQueryParams) =>
  reviewListPath + "?" + stringifyQs(params);

export const reviewPath = (id: string) => urlJoin(reviewsSection, id);
export type ReviewUrlDialog = "remove" | "assign-attribute-value";
export interface ReviewCreateUrlPageType {
  "review-type-id"?: string;
}
export type ReviewUrlQueryParams = Dialog<ReviewUrlDialog> & SingleAction;
export type ReviewCreateUrlQueryParams = Dialog<ReviewUrlDialog> & SingleAction & ReviewCreateUrlPageType;
export const reviewUrl = (id: string, params?: ReviewUrlQueryParams) =>
  reviewPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const reviewCreatePath = urlJoin(reviewsSection, "add");
export const reviewCreateUrl = (params?: ReviewCreateUrlQueryParams) =>
  reviewCreatePath + "?" + stringifyQs(params);
