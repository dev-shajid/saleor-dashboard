import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  reviewListPath,
  ReviewListUrlQueryParams,
  ReviewListUrlSortField,
  reviewPath,
} from "./urls";
import ReviewListComponent from './views/ReviewList'
import ReviewDetailsPage from "./views/ReviewDetailsPage";

const ReviewList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location?.search?.substr(1)) as any;
  const params: ReviewListUrlQueryParams = asSortParams(
    qs,
    ReviewListUrlSortField,
    ReviewListUrlSortField.updatedAt,
  );

  return <ReviewListComponent params={params} />;
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.reviews)} />
      <Switch>
        <Route exact path={reviewListPath} component={ReviewList} />
        <Route path={reviewPath(":id")} component={ReviewDetailsPage} />
      </Switch>
    </>
  );
};

export default Component;
