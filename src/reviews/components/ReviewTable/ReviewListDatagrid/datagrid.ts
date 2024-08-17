import { readonlyTextCell, tagsCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor } from "@dashboard/misc";
import { GridCell, Item } from "@glideapps/glide-data-grid";

import { formatDate, formatTime } from "../../../../../cypress/support/formatData/formatDate";
import { ReviewsQuery } from "@dashboard/graphql";
import { DefaultTheme } from "@saleor/macaw-ui-next";

export const reviewListStaticColumnsAdapter = (
): AvailableColumn[] =>
  [
    {
      id: "user",
      title: "User",
      width: 200,
    },
    {
      id: "product",
      title: "Product",
      width: 200,
    },
    {
      id: "title",
      title: "Title",
      width: 300,
    },
    {
      id: "rating",
      title: "Rating",
      width: 100,
    },
    {
      id: "updatedAt",
      title: "Updated At",
      width: 140,
    },
    {
      id: "status",
      title: "Status",
      width: 110,
    },
  ].map(column => ({
    ...column,
    // icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    reviews,
    columns,
    currentTheme,
  }: {
    reviews: ReviewsQuery | undefined;
    columns: AvailableColumn[];
    currentTheme: DefaultTheme;
  }) =>
    ([column, row]: Item): GridCell => {
      const rowData = reviews.getProductReviews?.[row];
      const columnId = columns[column]?.id;

      if (!columnId || !rowData) {
        return readonlyTextCell("");
      }

      switch (columnId) {
        case "user":
          return readonlyTextCell(rowData.user.firstName + " " + rowData.user.lastName ?? "");
        case "product":
          return readonlyTextCell(rowData?.product.name ?? "");
        case "title":
          return readonlyTextCell(rowData?.title ?? "");
        case "rating":
          const rating = (rowData.rating / Math.ceil(rowData.rating / 5)).toFixed(2)
          return readonlyTextCell(rating ?? "");
        case "updatedAt": {
          const date = new Date(rowData?.updatedAt);
          return readonlyTextCell(formatDate(new Date(date)) + ", " + formatTime(new Date(date)));
        }
        case "status": {
          const tag = rowData?.status
            ? "Approved"
            : "Not Approved";
          const color = getStatusColor({
            status: rowData?.status ? "success" : "error",
            currentTheme,
          });
          return tagsCell(
            [
              {
                tag,
                color: color.base,
              },
            ],
            [tag],
          );
        }
        // case "action":
        //   return readonlyTextCell(rowData?.action ?? "");
        default:
          return readonlyTextCell("");
      }
    };
