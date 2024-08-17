import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";

export const reviewSection = "/reviews/";

export const reviewListPath = reviewSection;
export enum ReviewListUrlFiltersEnum {
  query = "query",
}
export type ReviewListUrlFilters = Filters<ReviewListUrlFiltersEnum>;
export type ReviewListUrlDialog = "remove" | TabActionDialog;
export enum ReviewListUrlSortField {
  user = "user",
  product = "product",
  title = "title",
  rating = "rating",
  updatedAt = "updatedAt",
  status = "status",
}
export type ReviewListUrlSort = Sort<ReviewListUrlSortField>;
export type ReviewListUrlQueryParams = ActiveTab &
  BulkAction &
  ReviewListUrlFilters &
  ReviewListUrlSort &
  Dialog<ReviewListUrlDialog> &
  Pagination;
export const reviewListUrl = (params?: ReviewListUrlQueryParams) =>
  reviewListPath + "?" + stringifyQs(params);

export const reviewPath = (id: string) => urlJoin(reviewSection, id);
export type ReviewUrlDialog = "remove";
export type ReviewUrlQueryParams = Dialog<ReviewUrlDialog>;
export const reviewUrl = (id: string, params?: ReviewUrlQueryParams) =>
  reviewPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const reviewAddPath = urlJoin(reviewSection, "add");
export const reviewAddUrl = reviewAddPath;

export const reviewAddressesPath = (id: string) =>
  urlJoin(reviewPath(id), "addresses");
export type ReviewAddressesUrlDialog = "add" | "edit" | "remove";
export type ReviewAddressesUrlQueryParams =
  Dialog<ReviewAddressesUrlDialog> & SingleAction;
export const reviewAddressesUrl = (
  id: string,
  params?: ReviewAddressesUrlQueryParams,
) => reviewAddressesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
