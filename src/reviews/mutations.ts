import { gql } from "@apollo/client";

export const productMediaCreateMutation = gql`
  mutation ProductMediaCreate(
    $product: ID!
    $image: Upload
    $alt: String
    $mediaUrl: String
  ) {
    productMediaCreate(
      input: {
        alt: $alt
        image: $image
        product: $product
        mediaUrl: $mediaUrl
      }
    ) {
      errors {
        ...ProductError
      }
      product {
        id
        media {
          ...ProductMedia
        }
      }
    }
  }
`;

export const productDeleteMutation = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(id: $id) {
      errors {
        ...ProductError
      }
      product {
        id
      }
    }
  }
`;
export const productUpdateMutation = gql`
  mutation ProductUpdate($id: ID!, $input: ProductInput!) {
    productUpdate(id: $id, input: $input) {
      errors {
        ...ProductErrorWithAttributes
      }
    }
  }
`;

export const productCreateMutation = gql`
  mutation ProductCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      errors {
        ...ProductErrorWithAttributes
      }
      product {
        id
      }
    }
  }
`;