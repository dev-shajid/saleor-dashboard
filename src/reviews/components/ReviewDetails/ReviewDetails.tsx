// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  ReviewDetailsQuery,
} from "@dashboard/graphql";
import React from "react";
import ReviewInformation from "./ReviewInformation";

export interface ReviewDetailsPageFormData {
  user: { id: string, email: string, firstName: string, lastName: string };
  product: { id: string, name: string, media: { url: string }[] };
  media: {url:string, alt:string | null, type:string | null}[];
  title: string;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

export interface ReviewDetailsPageProps {
  reviewId: string;
  review: ReviewDetailsQuery["getProductReview"];
  disabled: boolean;
}

const ReviewDetails: React.FC<ReviewDetailsPageProps> = ({
  review,
  disabled,
}: ReviewDetailsPageProps) => {

  const initialForm: ReviewDetailsPageFormData = {
    user: review?.user,
    product: review?.product,
    title: review?.title!,
    review: review?.review!,
    createdAt: review?.createdAt!,
    updatedAt: review?.updatedAt!,
    status: review?.status || false,
    rating: review?.rating,
    media: review?.media,
  };

  return (
    <Form
      confirmLeave
      initial={initialForm}
      disabled={disabled}
    >
      {() => {

        return (
          <>
            <TopNav
              href={'/reviews'}
              title={"Review"}
            >
            </TopNav>
            <DetailPageLayout.Content>
              <CardSpacer />
              <ReviewInformation
                data={review}
                disabled={disabled}
              />
              <CardSpacer />
            </DetailPageLayout.Content>
          </>
        );
      }}
    </Form>
  );
};
ReviewDetails.displayName = "ReviewDetails";
export default ReviewDetails;
