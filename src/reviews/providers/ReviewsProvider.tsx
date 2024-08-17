
import {
    ReviewsQuery,
    useReviewsQuery,
} from "@dashboard/graphql";
import React, { createContext, useContext } from "react";


interface ReviewConsumerProps {
    reviews: ReviewsQuery | null;
    loading: boolean | null;
}

export const ReviewContext =
    createContext<ReviewConsumerProps>(null);

export const useReviews = () => {
    return useContext(ReviewContext);
};


const ReviewsProvider: React.FC = ({ children }) => {
    const { data:reviews, loading } = useReviewsQuery({
        displayLoader: true
    });


    const providerValues: ReviewConsumerProps = {
        reviews,
        loading,
    };

    return (
        <ReviewContext.Provider value={providerValues}>
            {children}
        </ReviewContext.Provider>
    );
};

export default ReviewsProvider;