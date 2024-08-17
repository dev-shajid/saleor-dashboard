
import {
    ReviewDetailsQuery,
    useReviewDetailsQuery,
} from "@dashboard/graphql";
import React, { createContext, useContext } from "react";

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

    console.log({data, loading})

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