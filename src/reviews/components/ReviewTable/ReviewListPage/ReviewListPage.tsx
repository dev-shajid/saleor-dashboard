// @ts-strict-ignore
import {
  ReviewListUrlSortField,
} from "@dashboard/reviews/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  ListSettings,
} from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

import { ReviewListDatagrid } from "../ReviewListDatagrid/ReviewListDatagrid";
import { gql, useMutation } from "@apollo/client";
import useNotifier from "@dashboard/hooks/useNotifier";
import { CircularProgress } from "@material-ui/core";
import { ReviewsQuery } from "@dashboard/graphql";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import ActionDialog from "@dashboard/components/ActionDialog";

enum ModalType {
  DELETE = 'Delete',
  APPROVE = 'Aprrove',
  DISAPPROVE = 'Disapprove',
}

const UPDATE_REVIEWS = gql`
  mutation UpdateReview($id: ID!, $status: Boolean!) {
    updateProductReview(
        input:{
            id:$id
            status: $status
        }
    ){
        review{
            id
            status
        }
        errors{
          code
          message
        }
    }
  }
`;

const DELETE_REVIEWS = gql`
  mutation DeleteReview($id: ID!) {
    deleteProductReview(
      id:$id
    ){
        review{
          id
        }
        errors{
          code
          message
        }
    }
  }
`;

export interface ReviewListPageProps {
  selectedReviewIds: string[];
  loading: boolean;
  reviews: ReviewsQuery
  settings: ListSettings<string>
  onSelectReviewIds: (rows: number[], clearSelection: () => void) => void;
  sort: Partial<{
    asc: boolean;
    sort: ReviewListUrlSortField;
  }>,
  onSort: (field: ReviewListUrlSortField, id?: string) => void

}

const ReviewListPage: React.FC<ReviewListPageProps> = ({
  loading,
  settings,
  reviews,
  onSort,
  sort,
  selectedReviewIds,
  onSelectReviewIds,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const [modalData, setModalData] = useState<{ open: boolean, type: ModalType | null, action: () => any | null, title?: string | null }>({ open: false, type: null, action: null, title: null });

  const [updateMutation, updateMutationResponse] = useMutation(UPDATE_REVIEWS, {
    onCompleted: data => {
      if (data.updateProductReview.errors.length === 0) {
        notify({
          status: "success",
          text: "Review Updated Successfully!",
        });
      }
      else {
        notify({
          status: "error",
          text: "Review Update Failed!",
        });
      }
    },
  });

  const [deleteMutation, deleteMutationResponse] = useMutation(DELETE_REVIEWS, {
    onCompleted: data => {
      if (data.deleteProductReview.errors.length === 0) {
        notify({
          status: "success",
          text: "Review Deleted Successfully!",
        });
      }
      else {
        notify({
          status: "error",
          text: "Review Deleted Failed!",
        });
      }
    },
  });

  const handleUpdateReviews = (status: boolean) => {
    selectedReviewIds.forEach((id) => {
      if (reviews?.getProductReviews.find(e => e.id == id).status != status)
        updateMutation({ variables: { id, status } });
    })
  }


  const handleDeleteReviews = () => {
    selectedReviewIds.forEach((id) => {
      deleteMutation({ variables: { id } });
    })
  }

  if (loading || updateMutationResponse.loading || deleteMutationResponse.loading) {
    return (
      <Box display="flex" justifyContent="center" marginY={9}>
        <CircularProgress />
      </Box>
    );
  }

  if (updateMutationResponse.error || deleteMutationResponse.error) {
    console.log({ error: [updateMutationResponse.error, deleteMutationResponse.error] })
    return (
      <>
        <Text color='critical1'>Something went wrong</Text>
        {JSON.stringify([updateMutationResponse.error, deleteMutationResponse.error])}
      </>
    )
  }

  return (
    <>
      <Box>
        {selectedReviewIds?.length > 0 && (
          <Box
            display="flex"
            alignItems="center"
            gap={4}
            paddingY={2}
            paddingX={6}
            justifyContent="flex-end"
          >
            <Box display="flex" gap={4}>
              <Button variant="primary" onClick={() => setModalData({ open: true, type: ModalType.APPROVE, action: () => handleUpdateReviews(true) })}>
                Approve
              </Button>
              <Button variant="error" onClick={() => setModalData({ open: true, type: ModalType.DISAPPROVE, action: () => handleUpdateReviews(false) })}>
                Disapprove
              </Button>
              <BulkDeleteButton onClick={() => setModalData({ open: true, type: ModalType.DELETE, action: handleDeleteReviews, })}>
                Delete
              </BulkDeleteButton>
            </Box>
          </Box>
        )}
        <ReviewListDatagrid
          onSort={onSort}
          sort={sort}
          onSelectReviewIds={onSelectReviewIds}
          onRowClick={id => navigate(`/reviews/${id}`)}
          reviews={reviews}
          loading={loading}
          settings={settings}
        />
      </Box>
      <ActionDialog
        open={modalData.open}
        onClose={() => {
          setModalData({ open: false, type: null, action: null, title: null })
        }}
        confirmButtonState={"default"}
        onConfirm={() => {
          modalData.action()
          setModalData({ open: false, type: null, action: null, title: null });
        }}
        variant="default"
        title={`${modalData.type} Review`}
      >
        {modalData.title || `Are you sure you want to ${modalData.type?.toLowerCase()} the selected review${selectedReviewIds.length > 1 ? "s" : ""}?`}
      </ActionDialog>
    </>
  );
};
ReviewListPage.displayName = "ReviewListPage";
export default ReviewListPage;
