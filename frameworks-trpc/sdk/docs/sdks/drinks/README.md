# Drinks
(*drinks*)

## Overview

Operations related to drinks

### Available Operations

* [searchDrink](#searchdrink) - Find a drink by product code

## searchDrink

Pass the product code of the drink to search for

### Example Usage

```typescript
import { SDK } from "openapi";

(async() => {
  const sdk = new SDK();

  const res = await sdk.drinks.searchDrink({
    code: "Account Usability Borders",
  });

  if (res.statusCode == 200) {
    // handle response
  }
})();
```

### Parameters

| Parameter                                                                                  | Type                                                                                       | Required                                                                                   | Description                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `request`                                                                                  | [operations.FindByProductCodeRequest](../../models/operations/findbyproductcoderequest.md) | :heavy_check_mark:                                                                         | The request object to use for the request.                                                 |
| `retries`                                                                                  | [utils.RetryConfig](../../models/utils/retryconfig.md)                                     | :heavy_minus_sign:                                                                         | Configuration to override the default retry behavior of the client.                        |
| `config`                                                                                   | [AxiosRequestConfig](https://axios-http.com/docs/req_config)                               | :heavy_minus_sign:                                                                         | Available config options for making requests.                                              |


### Response

**Promise<[operations.FindByProductCodeResponse](../../models/operations/findbyproductcoderesponse.md)>**

