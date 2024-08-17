
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ListPageLayout } from "@dashboard/components/Layouts";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Pages } from "@dashboard/pages/types";
import {
    PageListUrlDialog,
    PageListUrlQueryParams,
    pageUrl,
} from "@dashboard/pages/urls";
import {
    ListSettings,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import {messages} from "../../pages/components/PageListDatagrid/messages";

import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { createGetCellContent, pageListStaticColumnsAdapter } from "../../pages/components/PageListDatagrid/datagrid";
import { useDatagridChangeState } from "@dashboard/components/Datagrid/hooks/useDatagridChange";

export interface PageListActionDialogOpts {
    open: (action: PageListUrlDialog, newParams?: PageListUrlQueryParams) => void;
    close: () => void;
}
export interface ReviewListDataTableProps {
    pages: Pages | undefined;
    loading: boolean;
    disabled: boolean;
    settings: ListSettings<string>
}

const ReviewListDataTable: React.FC<ReviewListDataTableProps> = ({
    pages,
    loading,
    disabled,
    settings,
}) => {
    const sort={getSortParams({sort: "", asc: true})}
    const intl = useIntl();
    const navigate = useNavigator();
    const { theme: currentTheme } = useTheme();
    const datagrid = useDatagridChangeState();

    const pageListStaticColumns = useMemo(
        () => pageListStaticColumnsAdapter(intl, sort),
        [intl],
    );

    const onColumnChange = useCallback(
        (picked: string[]) => {
            // if (onUpdateListSettings) {
            //   onUpdateListSettings("columns", picked.filter(Boolean));
            // }
        },
        [],
    );


    const {
        visibleColumns,
    } = useColumns({
        staticColumns: pageListStaticColumnsAdapter,
        selectedColumns: settings?.columns ?? [],
        onSave: onColumnChange,
    });

    const getCellContent = useCallback(
        createGetCellContent({
            pages,
            columns: visibleColumns,
            intl,
            currentTheme,
        }),
        [pages, visibleColumns],
    );


    return (
        <ListPageLayout>
            <TopNav
                title={intl.formatMessage(sectionNames.content)}
                withoutBorder
            >
            </TopNav>
            <Card>
                <Datagrid
                    readonly
                    loading={true}
                    rowMarkers="checkbox-visible"
                    columnSelect="single"
                    // hasRowHover={hasRowHover}
                    // onColumnMoved={handlers.onMove}
                    // onColumnResize={handlers.onResize}
                    verticalBorder={col => col > 0}
                    rows={0}
                    availableColumns={visibleColumns}
                    emptyText={intl.formatMessage(messages?.empty)}
                    getCellContent={getCellContent}
                    getCellError={() => false}
                    selectionActions={() => null}
                    menuItems={() => []}
                    // onHeaderClicked={handleHeaderClick}
                    // rowAnchor={handleRowAnchor}
                    // recentlyAddedColumn={recentlyAddedColumn}
                    // renderColumnPicker={() => (
                    //     <ColumnPicker
                    //         staticColumns={staticColumns}
                    //         selectedColumns={selectedColumns}
                    //         onToggle={handlers.onToggle}
                    //     />
                    // )}
                    onRowClick={id => navigate(pageUrl(id))}
                />
            </Card>
        </ListPageLayout>
    );
};
ReviewListDataTable.displayName = "ReviewListDataTable";
export default ReviewListDataTable;
