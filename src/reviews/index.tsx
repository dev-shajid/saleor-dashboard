import { WindowTitle } from "@dashboard/components/WindowTitle";
import React from "react";
import './style.css'
import { Route, Switch } from "react-router";
import ReviewDetailsPage from "./views/ReviewDetailsPage";
import Reviews from "./views/Reviews";

export const reviewsMenuUrl = "/reviews/";

export const ReviewsSection: React.FC = () => {
  return (
    <div className="">
      <WindowTitle title='Reviews' />
      <Switch>
        <Route exact path={`/reviews`} component={Reviews} />
        <Route exact path={`/reviews/:id`} component={ReviewDetailsPage} />
      </Switch>
    </div>
  );
};
export default ReviewsSection;
