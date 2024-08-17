import React from 'react'
import { TopNav } from '@dashboard/components/AppLayout';
import { parse as parseQs } from "qs";
import ReviewList from '../components/ReviewTable/ReviewList';
import { ReviewListUrlQueryParams, ReviewListUrlSortField } from '@dashboard/reviews/urls';
import { asSortParams } from '@dashboard/utils/sort';
import { RouteComponentProps } from 'react-router';
import { WindowTitle } from '@dashboard/components/WindowTitle';
import NotFoundPage from '@dashboard/components/NotFoundPage';
import { Box, CircularProgress } from '@material-ui/core';
import ReviewsProvider, { useReviews } from '../providers/ReviewsProvider';

interface ReviewsViewProps {
  params: ReviewListUrlQueryParams;
}

const ReviewsViewInner: React.FC<ReviewsViewProps> = ({
  params,
}) => {

  const { reviews, loading } = useReviews();


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginY={9}>
        <CircularProgress />
      </Box>
    );
  }

  if (reviews?.getProductReviews === null) {
    return <NotFoundPage backHref={'/reviews'} />;
  }

  return (
    <>
      <WindowTitle title={"Reviews"} />
      <TopNav
        title={"Reviews"}
      >
      </TopNav>
      <ReviewList
        params={params}
        reviews={reviews}
        loading={loading}
      />
    </>
  );
};

const Reviews: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs((location.search || "?asc=true&sort=updatedAt").substr(1)) as any;
  const params: ReviewListUrlQueryParams = asSortParams(
    qs,
    ReviewListUrlSortField,
  );
  return (
    <div>
      <ReviewsProvider>
        <ReviewsViewInner params={params} />
      </ReviewsProvider>
    </div>
  )
}

export default Reviews