// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Grid from "@dashboard/components/Grid";
import { Card, CardContent, CardMedia, TextField } from "@material-ui/core";
import { makeStyles, TooltipMountWrapper } from "@saleor/macaw-ui";
import React, { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Button, Tooltip, useTheme } from "@saleor/macaw-ui-next";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PlayCircleFilled } from "@material-ui/icons";
import moment from "moment-timezone";

const useStyles = makeStyles(
  theme => ({
    content: {
      paddingTop: theme.spacing(2),
    },
    hr: {
      margin: theme.spacing(3, 0),
    },
    sectionHeader: {
      marginBottom: theme.spacing(),
    },
    card_title: {
      paddingLeft: theme.spacing(0),
    },
  }),
  { name: "ReviewInformation" },
);


function textSlice(text: string, length: number = 20) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

export interface ReviewInformationProps {
  data: {
    user: { id: string, email: string, firstName: string, lastName: string };
    product: { id: string, name: string, media: { url: string }[] };
    media: { url: string, alt: string | null, type: string | null }[];
    title: string;
    review: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    status: boolean;
  };
  disabled: boolean;
}

const ReviewInformation: React.FC<ReviewInformationProps> = props => {
  const { data, disabled } = props;
  const navigate = useNavigator();

  const classes = useStyles(props);
  const { theme: currentTheme } = useTheme()

  return (
    <Card>
      <CardTitle
        title={
          <FormattedMessage
            id="4v5gfh"
            defaultMessage="Review Information"
            description="Review information, header"
          />
        }
      />
      <CardContent className={classes.content}>
        {
          data.media.length > 0 ?
            <>
              <Box display="grid" gap={4} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 150px))' }}>
                {
                  data.media.map((media, index) => (
                    <Fragment key={index}>
                      {
                        media.type == 'IMAGE' ?
                          <a href={media.url} target="_blank" style={{ borderRadius: 5, maxWidth: '100%', background: currentTheme == 'defaultDark' ? '#424558' : '#bbbbbb' }}>
                            <CardMedia
                              image={media.url}
                              style={{ maxWidth: '100%', aspectRatio: '1/1', borderRadius: 5 }}
                            />
                          </a> : null
                      }
                      {
                        media.type == 'VIDEO' ?
                          <Tooltip>
                            <Tooltip.Trigger>
                              <TooltipMountWrapper>
                                <a href={media.url} target="_blank" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 5, maxWidth: '100%', aspectRatio: '1/1', textAlign: 'center', cursor: 'pointer', background: currentTheme == 'defaultDark' ? '#424558' : '#bbbbbb' }}>
                                  <PlayCircleFilled style={{ aspectRatio: '1/1', width: '4rem', fontSize: '4rem' }} />
                                  <p>{textSlice(media.alt)}</p>
                                </a>
                              </TooltipMountWrapper>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                              <Tooltip.Arrow />
                              {media.alt}
                            </Tooltip.Content>
                          </Tooltip> : null
                      }
                    </Fragment>
                  ))
                }
              </Box>
              <CardSpacer />
            </>
            : null
        }
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            fullWidth
            name="createdAt"
            type="text"
            label="Created At"
            value={moment(new Date(data.createdAt)).format("DD/MM/YYYY, hh:mm a")}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            disabled={disabled}
            fullWidth
            name="updatedAt"
            type="text"
            label="Updated At"
            value={moment(new Date(data.updatedAt)).format("DD/MM/YYYY, hh:mm a")}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <CardSpacer />
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            fullWidth
            name="rating"
            type="text"
            label="Rating"
            value={(data.rating / Math.ceil(data.rating / 5)).toFixed(2)}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            disabled={disabled}
            fullWidth
            name="status"
            type="text"
            label="Status"
            value={data.status ? "Approved" : "Not Approved"}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <CardSpacer />
        <TextField
          disabled={disabled}
          fullWidth
          name="Title"
          type="text"
          label="Review Title"
          value={data.title}
          InputProps={{
            readOnly: true,
          }}
        />
        <CardSpacer />
        <TextField
          disabled={disabled}
          fullWidth
          multiline
          name="Review"
          label="Review"
          value={data.review}
          InputProps={{
            readOnly: true,
          }}
        />
      </CardContent>

      <CardContent className={classes.content}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle className="card_title" title="User Information" />
          <Button size="small" variant="secondary" color='default2' onClick={() => navigate(`/customers/${data.user.id}`)}>
            User Details
          </Button>
        </Box>
        <TextField
          disabled={disabled}
          fullWidth
          name="name"
          type="text"
          label="Full Name"
          value={data.user.firstName + " " + data.user.lastName}
          InputProps={{
            readOnly: true,
          }}
        />
        <CardSpacer />
        <TextField
          disabled={disabled}
          fullWidth
          name="email"
          type="email"
          label="Email"
          value={data.user.email}
          InputProps={{
            readOnly: true,
          }}
        />
        <CardSpacer />
      </CardContent>


      <CardContent className={classes.content}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle className={classes.card_title} title="Product Information" />
          <Button size="small" variant="secondary" color='default2' onClick={() => navigate(`/products/${data.product.id}`)}>
            Product Details
          </Button>
        </Box>

        {
          data.product.media.length > 0 ?
            <>
              <Box display="grid" gap={4} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 150px))' }}>
                {
                  data.product.media.map((media, index) => (
                    <a href={media.url} target="_blank" key={index} style={{ borderRadius: 5, aspectRatio: '1/1', maxWidth: '100%', background: currentTheme == 'defaultDark' ? '#424558' : '#bbbbbb' }}>
                      <CardMedia
                        key={index}
                        image={media.url}
                        style={{ maxWidth: '100%', aspectRatio: '1/1', borderRadius: 5 }}
                      />
                    </a>))
                }
              </Box>
              <CardSpacer />
            </>
            : null
        }
        <TextField
          disabled={disabled}
          fullWidth
          name="product.name"
          type="product.name"
          label="Product Name"
          value={data.product.name}
          InputProps={{
            readOnly: true,
          }}
        />
        <CardSpacer />
      </CardContent>
    </Card>
  );
};
ReviewInformation.displayName = "ReviewInformation";
export default ReviewInformation;
