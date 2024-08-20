
import React, { createContext, useContext } from "react";
import { ReviewDetailsQuery, useReviewDetailsQuery } from "../graphql";

export interface ReviewDetailsProviderProps {
    id: string;
}

interface ReviewDetailsConsumerProps {
    review: ReviewDetailsQuery | null;
    loading: boolean | null;
}

export const ReviewDetailsContext =
    createContext<ReviewDetailsConsumerProps>(null);

export const useReviewDetails = () => {
    return useContext(ReviewDetailsContext);
};


const ReviewDetailsProvider: React.FC<ReviewDetailsProviderProps> = ({ children, id }) => {
    const { data, loading } = useReviewDetailsQuery({
        displayLoader: true,
        variables: {
            id,
        },
    });

    const providerValues: ReviewDetailsConsumerProps = {
        review: data,
        loading,
    };

    return (
        <ReviewDetailsContext.Provider value={providerValues}>
            {children}
        </ReviewDetailsContext.Provider>
    );
};

export default ReviewDetailsProvider;