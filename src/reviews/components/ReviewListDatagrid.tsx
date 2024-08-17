import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { formatDate, formatTime } from "../../../cypress/support/formatData/formatDate";
import { Link } from "react-router-dom";
import useNotifier from "@dashboard/hooks/useNotifier";


interface Review {
    id: string;
    review: string;
    title: string;
    rating: number;
    product: number;
    user: number;
    updatedAt: string;
    status: boolean;
}


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
    status
    createdAt
    updatedAt
  }
}
`;

const UPDATE_REVIEWS = gql`
  mutation UpdateReview($id: ID!, $status: Boolean!) {
    updateProductReview(
        input:{
            id:$id
            status: $status
        }
    ){
        review{
            id
            review
            title
            rating
            product
            user
            status
            media{
            url
            }
            createdAt
        }
        errors{
        code
        message
        }
    }
  }
`;

const ReviewListDatagrid: React.FC = () => {
    let { data, loading, error } = useQuery(GET_REVIEWS);
    const [rows, setRows] = useState([]);
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Review>('updatedAt');

    const notify = useNotifier();

    let reviews: Review[] = data?.getProductReviews || [];

    const [update, res] = useMutation(UPDATE_REVIEWS, {
        onCompleted: data => {
            console.log(data)
            if (data.updateProductReview.errors.length === 0) {
                notify({
                    status: "success",
                    text: "Review Updated Successfully!",
                });
            }
            else{
                notify({
                    status: "error",
                    text: "Review Update Failed!",
                });
            }
        },
    });


    useEffect(() => {
        setRows(reviews)
    }, [reviews])

    const sortByRating = (order: 'asc' | 'desc', orderBy: keyof Review) => {
        setOrder(order)
        setOrderBy(orderBy)
        let arr = [...rows].sort((a, b) => {
            let objA = a[orderBy], objB = b[orderBy];
            if (orderBy === 'updatedAt') objA = new Date(objA).getTime(), objB = new Date(objB).getTime();

            if (order === 'asc') {
                return objA - objB
            } else {
                return objB - objA
            }
        })
        setRows(arr)
    }


    if (loading || res.loading) {
        return (
            <Box display="flex" justifyContent="center" marginY={9}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || res.error) {
        return <Text color='critical1'>Something went wrong</Text>
    }

    return (
        <>
            <Paper className=''>
                <Box
                    backgroundColor="default1"
                    borderTopWidth={1}
                    borderTopStyle="solid"
                    borderColor="default1"
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">User</TableCell>
                                <TableCell align="left">Product</TableCell>
                                <TableCell align="left">Title</TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy == 'rating'}
                                        direction={order}
                                        onClick={() => sortByRating(order == 'asc' ? 'desc' : 'asc', 'rating')}
                                    >
                                        Rating
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy == 'updatedAt'}
                                        direction={order}
                                        onClick={() => sortByRating(order == 'asc' ? 'desc' : 'asc', 'updatedAt')}
                                    >
                                        Updated At
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy == 'status'}
                                        direction={order}
                                        onClick={() => sortByRating(order == 'asc' ? 'desc' : 'asc', 'status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => (
                                <TableRow key={i} hover={false}>
                                    <TableCell align="left">
                                        <Link to={`/customers/${row.user}`}>
                                            {row.user}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{row.product}</TableCell>
                                    <TableCell align="left">
                                        <Link to={`/reviews/${row.id}`} style={{ fontWeight: 'bold' }}>{row.title}</Link>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Text style={{ fontWeight: 'bold' }}>{(row.rating / Math.ceil(row.rating / 5)).toFixed(2)}</Text>
                                    </TableCell>
                                    <TableCell align="center" width="170px">{formatDate(new Date(row.updatedAt))}<br />{formatTime(new Date(row.updatedAt))}</TableCell>
                                    <TableCell width="170px" align="left">
                                        <span className={`status ${row.status ? 'approved' : 'not_approved'}`}>{row.status ? 'Approved' : 'Not Approved'}</span>
                                    </TableCell>
                                    <TableCell width="50px" align="right">
                                        <Checkbox
                                            checked={row.status}
                                            onChange={() => {
                                                update({ variables: { id: row.id, status: !row.status } });
                                            }}
                                            inputProps={{ 'aria-label': 'select all desserts' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={20}
                    page={0}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </Paper>
        </>
    )

};

export default ReviewListDatagrid;
