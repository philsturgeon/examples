import { generateOpenApiDocument } from "trpc-openapi";

import { ExtendedDocument, ExtendedOperationObject } from "./extended-types";
import { appRouter } from "./router";

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Train Travel API",
  description: "API for finding and booking train trips across Europe.",
  version: "1.2.1",
  baseUrl: "https://try.microcks.io/rest/Train+Travel+API/1.0.0",
  tags: ["Stations", "Trips", "Bookings", "Payments"],
});

// Override servers
openApiDocument.servers = [
  {
    url: "https://try.microcks.io/rest/Train+Travel+API/1.0.0",
    description: "Mock Server",
  },
  {
    url: "https://api.example.com",
    description: "Production",
  },
];

// Add contact and license to info
(openApiDocument.info as any).contact = {
  name: "Train Support",
  url: "https://example.com/support",
  email: "support@example.com",
};
(openApiDocument.info as any).license = {
  name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// Add tags with descriptions
openApiDocument.tags = [
  {
    name: "Stations",
    description:
      "Find and filter train stations across Europe, including location and local timezone.",
  },
  {
    name: "Trips",
    description:
      "Timetables and routes for train trips between stations, including pricing and availability.",
  },
  {
    name: "Bookings",
    description:
      "Create and manage bookings for train trips, including passenger details and optional extras.",
  },
  {
    name: "Payments",
    description:
      "Pay for bookings using a card or bank account, and view payment status and history.",
  },
];

// Add OAuth2 security scheme
openApiDocument.components = {
  ...openApiDocument.components,
  schemas: openApiDocument?.components?.schemas || {},
  securitySchemes: {
    OAuth2: {
      type: "oauth2",
      flows: {
        authorizationCode: {
          authorizationUrl: "https://example.com/oauth/authorize",
          tokenUrl: "https://example.com/oauth/token",
          scopes: {
            read: "Read access",
            write: "Write access",
          },
        },
      },
    },
  },
};

// Set global security
openApiDocument.security = [{ OAuth2: ["read"] }];

// Add global x-speakeasy-retries
(openApiDocument as ExtendedDocument)["x-speakeasy-retries"] = {
  strategy: "backoff",
  backoff: {
    initialInterval: 500,
    maxInterval: 60000,
    maxElapsedTime: 3600000,
    exponent: 1.5,
  },
  statusCodes: ["5XX"],
  retryConnectionErrors: true,
};

// Add x-speakeasy-name-override to select operations
const searchTripsOp = openApiDocument.paths?.["/trips"]?.get;
if (searchTripsOp) {
  (searchTripsOp as ExtendedOperationObject)[
    "x-speakeasy-name-override"
  ] = "searchTrips";
  (searchTripsOp as ExtendedOperationObject)["x-speakeasy-retries"] = {
    strategy: "backoff",
    backoff: {
      initialInterval: 500,
      maxInterval: 60000,
      maxElapsedTime: 3600000,
      exponent: 1.5,
    },
    statusCodes: ["5XX"],
    retryConnectionErrors: true,
  };
}

const createBookingOp = openApiDocument.paths?.["/bookings"]?.post;
if (createBookingOp) {
  (createBookingOp as ExtendedOperationObject)[
    "x-speakeasy-name-override"
  ] = "createBooking";
}

const payOp = openApiDocument.paths?.["/bookings/{bookingId}/payment"]?.post;
if (payOp) {
  (payOp as ExtendedOperationObject)["x-speakeasy-name-override"] = "pay";
}

export { openApiDocument };
