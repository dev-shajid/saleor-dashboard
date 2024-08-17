
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback, useState } from "react";
import {
  ReviewsQuery,
} from "@dashboard/graphql";

import {
  reviewListUrl,
  ReviewListUrlQueryParams,
} from "../../urls";
import ReviewListPage from "./ReviewListPage/ReviewListPage";

interface ReviewListProps {
  params: ReviewListUrlQueryParams;
  reviews: ReviewsQuery,
  loading: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ params, reviews: data, loading: reviewsLoading }) => {
  const navigate = useNavigator();
  const [reviews, setReviews] = useState<ReviewsQuery | null>(data);
  const { settings } = useListSettings(
    ListViews.REVIEW_LIST,
  );


  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  const paginationState = createPaginationState(settings.rowNumber, params);

  const paginationValues = usePaginator({
    pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: "", endCursor: "" },
    paginationState,
    queryString: params,
  });

  const handleSort = (field: string) => {
    if (!field || !reviews.getProductReviews || field=='user' || field=='product') return;
    createSortHandler<string>(navigate, reviewListUrl, params)(field)
    setReviews((pre) => {
      let arr = new Array(pre.getProductReviews)

      return {
        getProductReviews: arr[0].slice().sort((a, b) => {
          let objA = a[field], objB = b[field];
          if (field === 'updatedAt') objA = new Date(objA).getTime(), objB = new Date(objB).getTime();
          if (params.asc) return objA - objB
          return objB - objA
        })
      }
    })
  }


  const handleSetSelectedReviewIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!reviews.getProductReviews) {
        return;
      }

      const rowsIds = rows.map(row => reviews.getProductReviews[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      reviews,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <ReviewListPage
        reviews={reviews}
        settings={settings}
        loading={reviewsLoading}
        onSort={handleSort}
        selectedReviewIds={selectedRowIds}
        onSelectReviewIds={handleSetSelectedReviewIds}
        sort={getSortParams(params)}
      />
    </PaginatorContext.Provider>
  );
};
export default ReviewList;
