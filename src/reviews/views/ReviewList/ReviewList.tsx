// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { getSortParams } from "@dashboard/utils/sort";
// import isEqual from "lodash/isEqual";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { DatagridChangeStateContext, useDatagridChangeState } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { Box, Button, useTheme } from "@saleor/macaw-ui-next";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { TopNav } from "@dashboard/components/AppLayout";
import { sectionNames } from "@dashboard/intl";
import { DashboardCard } from "@dashboard/components/Card";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";



import { reviewListUrl, ReviewListUrlQueryParams, ReviewListUrlSortField, reviewUrl } from "../../urls";
import { getFilterQueryParam } from "./filters";
import { createGetCellContent, reviewListStaticColumnsAdapter } from "../../components/ReviewListDatagrid/datagrid";
import { messages } from "../../components/ReviewListDatagrid/messages";
import { ProductReviewsQuery, useProductReviewsQuery } from "@dashboard/reviews/graphql";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { isEqual } from "lodash";
import { gql, useMutation } from "@apollo/client";

interface ReviewListProps {
  params: ReviewListUrlQueryParams;
}

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

export const ReviewList: React.FC<ReviewListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.REVIEW_LIST);
  const [reviews, setReviews] = React.useState<ProductReviewsQuery['getProductReviews']>(null);
  const [modalData, setModalData] = React.useState<{ open: boolean, type: ModalType | null, action: () => any | null, title?: string | null }>({ open: false, type: null, action: null, title: null });


  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
  const [_, __, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: reviewListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });


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
    onCompleted: (data) => {
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


  usePaginationReset(reviewListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  // const queryVariables = React.useMemo(
  //   () => ({
  //     ...paginationState,
  //     // filter: getFilterVariables(params),
  //     sort: getSortQueryVariables(params),
  //   }),
  //   [params, settings.rowNumber],
  // );

  const { data: fetchedAllReviews, refetch } = useProductReviewsQuery({
    variables: null,
    onCompleted: ({ getProductReviews }) => {
      if (!getProductReviews) return [];
      setReviews(() => {
        let arr = new Array(getProductReviews)
        const field = params.sort as ReviewListUrlSortField
        if (!field || field == 'user' || field == 'product') return arr[0]

        let newReviews = arr[0].slice().sort((a, b) => {
          let objA = a[field], objB = b[field];
          if (field === 'updatedAt') objA = new Date(objA as string).getTime(), objB = new Date(objB as string).getTime();
          const numA = Number(objA), numB = Number(objB)
          if (!params.asc) return numA - numB
          return numB - numA
        })

        if (params.query) return newReviews?.filter(e => e.product.name.toLowerCase().includes(params.query.toLowerCase()))
        return newReviews
      })
    }
  })




  const handleUpdateReviews = (status: boolean) => {
    selectedRowIds.forEach((id) => {
      if (reviews?.find(e => e.id == id).status != status) updateMutation({ variables: { id, status } });
    })
    clearRowSelection()
  }


  const handleDeleteReviews = () => {
    selectedRowIds.forEach((id) => {
      deleteMutation({ variables: { id } });
    })
    clearRowSelection()
    refetch()
  }

  React.useEffect(() => {
    if (params.query) setReviews(pre => pre?.filter(e => e.product.name.toLowerCase().includes(params.query.toLowerCase())))
    else setReviews(fetchedAllReviews?.getProductReviews)
  }, [params.query])



  const paginationValues = usePaginator({
    pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null },
    paginationState,
    queryString: params,
  });


  const handleSort = (field: string) => {
    if (!field || !reviews || field == 'user' || field == 'product') return;
    createSortHandler<string>(navigate, reviewListUrl, params)(field)
    setReviews((pre) => {
      let arr = new Array(pre)

      return arr[0].slice().sort((a, b) => {
        let objA = a[field], objB = b[field];
        if (field === 'updatedAt') objA = new Date(objA).getTime(), objB = new Date(objB).getTime();
        if (!params.asc) return objA - objB
        return objB - objA
      })
    })
  }

  const handleSetSelectedReviewIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!reviews) {
        return;
      }

      const rowsIds = rows.map(row => reviews[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(() => rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [reviews, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  /* #################FIXME:####################### */
  const sort = getSortParams(params);

  const datagrid = useDatagridChangeState();
  const reviewListStaticColumns = useMemo(
    () => reviewListStaticColumnsAdapter(getSortParams(params)),
    [sort]);

  const onColumnChange = useCallback(
    (picked: string[]) => {
      if (updateListSettings) {
        updateListSettings("columns", picked.filter(Boolean));
      }
    },
    [updateListSettings],
  );
  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "review_list",
      staticColumns: reviewListStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });


  const { theme: currentTheme } = useTheme();

  const getCellContent = useCallback(
    createGetCellContent({
      reviews,
      columns: visibleColumns,
      currentTheme,
    }),
    [reviews, visibleColumns],
  );

  const handleRowClick = useCallback(
    ([_, row]) => {
      if (!reviews) return;

      navigate(reviewUrl(reviews[row]?.id))
    }, [reviews]);

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as ReviewListUrlSortField;
      handleSort(columnName);
    },
    [visibleColumns],
  );

  // console.log({ reviews, visibleColumns, getCellContent, })
  /* #################FIXME:####################### */

  return (
    <PaginatorContext.Provider
      value={paginationValues}
    >

      <ListPageLayout>
        <TopNav title={intl.formatMessage(sectionNames.reviews)} isAlignToRight={false} withoutBorder />
        <DashboardCard>
          <ListFilters
            showFilter={false}
            initialSearch={params?.query ?? ""}
            searchPlaceholder={"Search Review by product"}
            onSearchChange={handleSearchChange}
            actions={
              selectedRowIds.length > 0 && (
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
              )
            }
          />
          <DatagridChangeStateContext.Provider value={datagrid}>
            <Datagrid
              readonly
              loading={!reviews || updateMutationResponse.loading || deleteMutationResponse.loading}
              rowMarkers="checkbox-visible"
              columnSelect="single"
              hasRowHover={true}
              onColumnMoved={handlers.onMove}
              onColumnResize={handlers.onResize}
              verticalBorder={false}
              rows={reviews?.length ?? 0}
              availableColumns={visibleColumns}
              emptyText={intl.formatMessage(messages.empty)}
              onRowSelectionChange={handleSetSelectedReviewIds}
              getCellContent={getCellContent}
              getCellError={() => false}
              selectionActions={() => null}
              menuItems={() => []}
              onRowClick={handleRowClick}
              onHeaderClicked={handleHeaderClick}
              recentlyAddedColumn={recentlyAddedColumn}
              renderColumnPicker={() => (
                <ColumnPicker
                  staticColumns={staticColumns}
                  selectedColumns={selectedColumns}
                  onToggle={handlers.onToggle}
                />
              )}
            />

            {/* <Box paddingX={6}>
              <TablePaginationWithContext
                component="div"
                settings={settings}
                disabled={!reviews}
                onUpdateListSettings={updateListSettings}
              />
            </Box> */}
          </DatagridChangeStateContext.Provider>

        </DashboardCard>
      </ListPageLayout>


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
        {modalData.title || `Are you sure you want to ${modalData.type?.toLowerCase()} the selected review${selectedRowIds.length > 1 ? "s" : ""}?`}
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};

export default ReviewList;
