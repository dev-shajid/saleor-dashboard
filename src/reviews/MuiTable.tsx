import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatDate, formatTime } from "../../cypress/support/formatData/formatDate";

import { MoreVert } from '@material-ui/icons';
import { gql, useQuery } from '@apollo/client';
import { Checkbox } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


const GET_REVIEWS = gql`
query GetReviews {
  getProductReviews{
    id
    review
    title
    rating
    product
    user
    media{
      url
    }
    createdAt
  }
}
`;

export default function MuiTable() {
    const classes = useStyles();

    const { data, loading, error } = useQuery(GET_REVIEWS);

    const allReviews = data?.getProductReviews || [];
    console.log(allReviews)

    if (loading) return <h1>Loading...</h1>
    if (error) return <>{JSON.stringify(error, null, 2)}</>

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>PRODUCT</TableCell>
                        <TableCell align="right">REVIEWER</TableCell>
                        <TableCell align="right">REVIEW</TableCell>
                        <TableCell align="right">CREATED</TableCell>
                        <TableCell align="right">VISIBILITY</TableCell>
                        <TableCell align="right">ACTION</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allReviews.map((review, i) => (
                        <TableRow key={i}>
                            <TableCell component="th" scope="row">
                                <img src={reviews[i].productImage} alt={reviews[i].productName} />
                                <span>{reviews[i].productName}</span>
                            </TableCell>
                            <TableCell>
                                <img src={reviews[i].reviewerImage} alt={reviews[i].reviewerName} />
                                <div>
                                    <div>{reviews[i].reviewerName}</div>
                                    <div>{reviews[i].reviewerEmail}</div>
                                </div>
                            </TableCell>
                            <TableCell style={{ width: "400px" }}>
                                <div className="review-content">
                                    <div className="stars">⭐⭐⭐⭐⭐</div>
                                    <div>
                                        <strong>{review.title}</strong>
                                        <div>{review.review}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{formatDate(new Date(review.createdAt))}, {formatTime(new Date(review.createdAt))}</TableCell>
                            <TableCell>
                                <span className={`status ${review.status ? 'approved' : 'not_approved'}`}>{review.status ? 'Approved' : 'Not Approved'}</span>
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={true}
                                    onChange={() => {}}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const reviews = [
    {
        productImage: 'https://placehold.co/50',
        productName: 'Brown Hat',
        reviewerImage: 'https://placehold.co/50',
        reviewerName: 'Amanda Harvey',
        reviewerEmail: 'amanda@site.com',
        reviewTitle: 'I just love it!',
        reviewText: 'I bought this hat for my boyfriend, but then I found out he cheated on me so I kept it and I love it!! I wear it all the time and there is no problem with the fit even though it\'s a men\'s hat.',
        reviewDate: 'Aug 17, 2020, 5:48',
        status: 'Published',
    },
    {
        productImage: 'https://placehold.co/50',
        productName: 'Calvin Klein t-shirts',
        reviewerImage: 'https://placehold.co/50',
        reviewerName: 'Anne Richard',
        reviewerEmail: 'anne@site.com',
        reviewTitle: 'Really nice',
        reviewText: 'Material is great and very comfortable and stylish.',
        reviewDate: 'Aug 04, 2020, 3:17',
        status: 'Pending',
    },
    {
        productImage: 'https://placehold.co/50',
        productName: 'Clarks shoes',
        reviewerImage: 'https://placehold.co/50',
        reviewerName: 'David Harrison',
        reviewerEmail: 'david@site.com',
        reviewTitle: 'Good product',
        reviewText: 'A really well built shoe. It looks great and wears just as well. A great staple in ball caps.',
        reviewDate: 'June 18, 2020, 09:19',
        status: 'Published',
    }
]