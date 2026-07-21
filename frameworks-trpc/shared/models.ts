import { z } from "zod";

export const StationSchema = z.object({
  id: z.string().uuid().meta({
    description: "Unique station ID",
    example: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
  }),
  name: z.string().meta({
    description: "Name of the station",
    example: "Berlin Hauptbahnhof",
  }),
  address: z.string().meta({
    description: "Street address of the station",
    example: "Invalidenstrasse 10557 Berlin, Germany",
  }),
  country_code: z.string().meta({
    description: "ISO 3166-1 alpha-2 country code",
    example: "DE",
  }),
  timezone: z
    .string()
    .meta({
      description: "IANA timezone of the station",
      example: "Europe/Berlin",
    })
    .optional(),
});

export type Station = z.infer<typeof StationSchema>;

export const TripSchema = z.object({
  id: z.string().uuid().meta({
    description: "Unique trip ID",
    example: "ea399ba1-6d95-433f-92d1-83f67b775594",
  }),
  origin: z.string().uuid().meta({
    description: "ID of the origin station",
    example: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
  }),
  destination: z.string().uuid().meta({
    description: "ID of the destination station",
    example: "b2e783e1-c824-4d63-b37a-d8d698862f1d",
  }),
  departure_time: z.string().meta({
    description: "Departure time in ISO 8601 format",
    example: "2024-02-01T10:00:00Z",
  }),
  arrival_time: z.string().meta({
    description: "Arrival time in ISO 8601 format",
    example: "2024-02-01T16:00:00Z",
  }),
  price: z.number().meta({
    description: "Ticket price in euros",
    example: 50,
  }),
  operator: z.string().meta({
    description: "Train operator name",
    example: "Deutsche Bahn",
  }),
  bicycles_allowed: z.boolean().meta({
    description: "Whether bicycles are permitted",
    example: true,
  }),
  dogs_allowed: z.boolean().meta({
    description: "Whether dogs are permitted",
    example: true,
  }),
});

export type Trip = z.infer<typeof TripSchema>;

export const BookingInputSchema = z.object({
  trip_id: z.string().uuid().meta({
    description: "ID of the trip to book",
    example: "ea399ba1-6d95-433f-92d1-83f67b775594",
  }),
  passenger_name: z.string().meta({
    description: "Full name of the passenger",
    example: "John Doe",
  }),
  has_bicycle: z
    .boolean()
    .meta({
      description: "Whether the passenger has a bicycle",
      example: true,
    })
    .optional(),
  has_dog: z
    .boolean()
    .meta({
      description: "Whether the passenger has a dog",
      example: true,
    })
    .optional(),
});

export const BookingSchema = z.object({
  id: z.string().uuid().meta({
    description: "Unique booking ID",
    example: "1725ff48-ab45-4bb5-9d02-88745177dedb",
  }),
  trip_id: z.string().uuid().meta({
    description: "ID of the booked trip",
    example: "ea399ba1-6d95-433f-92d1-83f67b775594",
  }),
  passenger_name: z.string().meta({
    description: "Full name of the passenger",
    example: "John Doe",
  }),
  has_bicycle: z.boolean().meta({
    description: "Whether the passenger has a bicycle",
    example: true,
  }),
  has_dog: z.boolean().meta({
    description: "Whether the passenger has a dog",
    example: true,
  }),
});

export type Booking = z.infer<typeof BookingSchema>;

export const BookingPaymentInputSchema = z.object({
  amount: z.number().meta({
    description: "Amount to pay in the specified currency",
    example: 50,
  }),
  currency: z.string().meta({
    description: "ISO 4217 currency code (e.g. EUR)",
    example: "EUR",
  }),
  source: z
    .object({
      object: z.enum(["card", "bank_account"]).meta({
        description: "Payment source type",
        example: "card",
      }),
      name: z.string().meta({
        description: "Cardholder or account holder name",
        example: "John Doe",
      }),
      number: z.string().meta({
        description: "Card or bank account number",
        example: "4242424242424242",
      }),
    })
    .meta({ description: "Payment source details" }),
});

export const BookingPaymentSchema = z.object({
  id: z.string().uuid().meta({
    description: "Unique payment ID",
    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  }),
  amount: z.number().meta({
    description: "Amount paid",
    example: 50,
  }),
  currency: z.string().meta({
    description: "Currency of the payment",
    example: "EUR",
  }),
  status: z.enum(["succeeded", "failed", "pending"]).meta({
    description: "Payment status",
    example: "succeeded",
  }),
});

export type BookingPayment = z.infer<typeof BookingPaymentSchema>;