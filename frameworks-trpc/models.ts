import { z } from "zod";

export const StationSchema = z.object({
  id: z.string().uuid().describe("Unique station ID"),
  name: z.string().describe("Name of the station"),
  address: z.string().describe("Street address of the station"),
  country_code: z.string().describe("ISO 3166-1 alpha-2 country code"),
  timezone: z.string().optional().describe("IANA timezone of the station"),
});

export type Station = z.infer<typeof StationSchema>;

export const TripSchema = z.object({
  id: z.string().uuid().describe("Unique trip ID"),
  origin: z.string().uuid().describe("ID of the origin station"),
  destination: z.string().uuid().describe("ID of the destination station"),
  departure_time: z.string().describe("Departure time in ISO 8601 format"),
  arrival_time: z.string().describe("Arrival time in ISO 8601 format"),
  price: z.number().describe("Ticket price in euros"),
  operator: z.string().describe("Train operator name"),
  bicycles_allowed: z.boolean().describe("Whether bicycles are permitted"),
  dogs_allowed: z.boolean().describe("Whether dogs are permitted"),
});

export type Trip = z.infer<typeof TripSchema>;

export const BookingInputSchema = z.object({
  trip_id: z.string().uuid().describe("ID of the trip to book"),
  passenger_name: z.string().describe("Full name of the passenger"),
  has_bicycle: z.boolean().optional().describe("Whether the passenger has a bicycle"),
  has_dog: z.boolean().optional().describe("Whether the passenger has a dog"),
});

export const BookingSchema = z.object({
  id: z.string().uuid().describe("Unique booking ID"),
  trip_id: z.string().uuid().describe("ID of the booked trip"),
  passenger_name: z.string().describe("Full name of the passenger"),
  has_bicycle: z.boolean().describe("Whether the passenger has a bicycle"),
  has_dog: z.boolean().describe("Whether the passenger has a dog"),
});

export type Booking = z.infer<typeof BookingSchema>;

export const BookingPaymentInputSchema = z.object({
  amount: z.number().describe("Amount to pay in the specified currency"),
  currency: z.string().describe("ISO 4217 currency code (e.g. EUR)"),
  source: z
    .object({
      object: z
        .enum(["card", "bank_account"])
        .describe("Payment source type"),
      name: z.string().describe("Cardholder or account holder name"),
      number: z.string().describe("Card or bank account number"),
    })
    .describe("Payment source details"),
});

export const BookingPaymentSchema = z.object({
  id: z.string().uuid().describe("Unique payment ID"),
  amount: z.number().describe("Amount paid"),
  currency: z.string().describe("Currency of the payment"),
  status: z
    .enum(["pending", "succeeded", "failed"])
    .describe("Payment status"),
});

export type BookingPayment = z.infer<typeof BookingPaymentSchema>;
