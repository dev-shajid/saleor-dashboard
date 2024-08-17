import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { ReviewListUrlSortField } from "../../../urls";
import { PermissionEnum, ReviewsQuery } from "@dashboard/graphql";
import { ListSettings } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  createGetCellContent,
  reviewListStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { useTheme } from "@dashboard/theme";

interface ReviewListDatagridProps 
{
  reviews: ReviewsQuery | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectReviewIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
  onSort: (field: ReviewListUrlSortField, id?: string) => void
  sort: Partial<{
    asc: boolean;
    sort: ReviewListUrlSortField;
  }>
  // onUpdateListSettings: <T extends keyof ListSettings<string>>(key: T, value: ListSettings<string>[T]) => void
  settings: ListSettings<string>

}

export const ReviewListDatagrid = ({
  reviews,
  sort,
  loading,
  settings,
  onRowClick,
  rowAnchor,
  onSelectReviewIds,
  onSort,
}: ReviewListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const userPermissions = useUserPermissions();
  const hasManageOrdersPermission =
    userPermissions?.some(perm => perm.code === PermissionEnum.MANAGE_ORDERS) ??
    false;

  const reviewListStaticColumns = useMemo(
    () =>
      reviewListStaticColumnsAdapter(),
    [intl, sort, hasManageOrdersPermission],
  );

  const {
    handlers,
    visibleColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: reviewListStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: null,
  });

  const { theme: currentTheme } = useTheme();

  const getCellContent = useCallback(
    createGetCellContent({
      reviews: reviews,
      columns: visibleColumns,
      currentTheme,
    }),
    [reviews?.getProductReviews, visibleColumns, currentTheme],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !reviews) {
        return;
      }

      const clickedRow: ReviewsQuery = reviews;
      const rowData = clickedRow.getProductReviews[row];
      onRowClick(rowData.id);
    },
    [onRowClick, reviews],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      // console.log({ rowAnchor, reviews })
      // return // TODO:
      if (!rowAnchor || !reviews) {
        return "";
      }
      const rowData: any = reviews.getProductReviews[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, reviews],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      // console.log({ col, visibleColumns })
      // return // TODO:
      const columnName = visibleColumns[col].id as ReviewListUrlSortField;
      onSort(columnName, columnName);
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={true}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 0}
        rows={reviews?.getProductReviews?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectReviewIds}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
      />

      {/* <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box> */}
    </DatagridChangeStateContext.Provider>
  );
};
