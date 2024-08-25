import React from 'react'
import ReviewDetailsProvider, { useReviewDetails } from '../providers/ReviewDetailsProvider'
import NotFoundPage from '@dashboard/components/NotFoundPage';
import { WindowTitle } from '@dashboard/components/WindowTitle';
import { Box, CircularProgress } from "@material-ui/core";
import ReviewDetails from '../components/ReviewDetails/ReviewDetails';

interface ReviewDetailsViewProps {
  id: string;
}

const ReviewDetailsViewInner: React.FC<ReviewDetailsViewProps> = ({
  id,
}) => {

  const reviewDetails = useReviewDetails();
  const review = reviewDetails.review?.getProductReview?.[0]
  const reviewDetailsLoading = reviewDetails?.loading;


  if (reviewDetailsLoading) {
    return (
      <Box display="flex" justifyContent="center" marginY={9}>
        <CircularProgress />
      </Box>
    );
  }

  if (review?.getProductReview === null) {
    return <NotFoundPage backHref={'/dashboard/reviews'} />;
  }
  // console.log({review, id, reviewDetailsLoading})

  return (
    <>
      <WindowTitle title={"Review"} />
      <ReviewDetails
        reviewId={id}
        review={review}
        disabled={reviewDetailsLoading}
      />
    </>
  );
};

export default function ReviewDetailsPage({ match }) {
  const id = match.params.id?.replaceAll('%3D','=')
  return (
    <div>
      <ReviewDetailsProvider id={id}>
        <ReviewDetailsViewInner id={id} />
      </ReviewDetailsProvider>
    </div>
  )
}
