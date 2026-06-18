import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { z } from "zod";

import {
  StationSchema,
  TripSchema,
  BookingInputSchema,
  BookingSchema,
  BookingPaymentInputSchema,
  BookingPaymentSchema,
} from "./models";
import { db } from "./db";

const t = initTRPC.meta<OpenApiMeta>().create();

export const appRouter = t.router({
  getStations: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/stations",
        summary: "Get a list of train stations",
        description:
          "Returns a paginated and searchable list of all train stations.",
        tags: ["Stations"],
        example: {
          request: { search: "Berlin", country: "DE" },
          response: {
            data: [
              {
                id: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
                name: "Berlin Hauptbahnhof",
                address: "Invalidenstrasse 10557 Berlin, Germany",
                country_code: "DE",
                timezone: "Europe/Berlin",
              },
            ],
          },
        },
      },
    })
    .input(
      z.object({
        page: z.number().optional().describe("Page number to return"),
        search: z
          .string()
          .optional()
          .describe("Filter stations by name or address"),
        country: z
          .string()
          .optional()
          .describe("Filter stations by ISO 3166-1 alpha-2 country code"),
      })
    )
    .output(z.object({ data: z.array(StationSchema) }))
    .query(async ({ input }) => {
      const stations = await db.station.findAll(input);
      return { data: stations };
    }),

  getTrips: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/trips",
        summary: "Get available train trips",
        description:
          "Returns a list of available train trips between two stations on a given date.",
        tags: ["Trips"],
        example: {
          request: {
            origin: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
            destination: "b2e783e1-c824-4d63-b37a-d8d698862f1d",
            date: "2024-02-01",
          },
          response: {
            data: [
              {
                id: "ea399ba1-6d95-433f-92d1-83f67b775594",
                origin: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
                destination: "b2e783e1-c824-4d63-b37a-d8d698862f1d",
                departure_time: "2024-02-01T10:00:00Z",
                arrival_time: "2024-02-01T16:00:00Z",
                price: 50,
                operator: "Deutsche Bahn",
                bicycles_allowed: true,
                dogs_allowed: true,
              },
            ],
          },
        },
      },
    })
    .input(
      z.object({
        origin: z.string().uuid().describe("ID of the origin station"),
        destination: z.string().uuid().describe("ID of the destination station"),
        date: z.string().describe("Travel date in YYYY-MM-DD format"),
        bicycles: z
          .boolean()
          .optional()
          .describe("Only return trips that allow bicycles"),
        dogs: z
          .boolean()
          .optional()
          .describe("Only return trips that allow dogs"),
      })
    )
    .output(z.object({ data: z.array(TripSchema) }))
    .query(async ({ input }) => {
      const trips = await db.trip.findAll(input);
      return { data: trips };
    }),

  getBookings: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/bookings",
        summary: "List existing bookings",
        description:
          "Returns a list of all bookings associated with the authenticated user.",
        tags: ["Bookings"],
        protect: true,
      },
    })
    .input(
      z.object({
        page: z.number().optional().describe("Page number to return"),
      })
    )
    .output(z.object({ data: z.array(BookingSchema) }))
    .query(async () => {
      const bookings = await db.booking.findAll();
      return { data: bookings };
    }),

  createBooking: t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/bookings",
        summary: "Create a booking",
        description: "Creates a new booking for a selected train trip.",
        tags: ["Bookings"],
        protect: true,
      },
    })
    .input(BookingInputSchema)
    .output(BookingSchema)
    .mutation(async ({ input }) => {
      const booking = await db.booking.create(input);
      return booking;
    }),

  getBooking: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/bookings/{bookingId}",
        summary: "Get a booking",
        description: "Returns the details of a specific booking.",
        tags: ["Bookings"],
        protect: true,
      },
    })
    .input(
      z.object({
        bookingId: z.string().uuid().describe("The ID of the booking"),
      })
    )
    .output(BookingSchema)
    .query(async ({ input }) => {
      const booking = await db.booking.findById(input.bookingId);
      if (!booking)
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      return booking;
    }),

  deleteBooking: t.procedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/bookings/{bookingId}",
        summary: "Delete a booking",
        description: "Deletes a booking by ID.",
        tags: ["Bookings"],
        protect: true,
      },
    })
    .input(
      z.object({
        bookingId: z.string().uuid().describe("The ID of the booking"),
      })
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const booking = await db.booking.findById(input.bookingId);
      if (!booking)
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      await db.booking.delete(input.bookingId);
      return { message: "Booking deleted" };
    }),

  createBookingPayment: t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/bookings/{bookingId}/payment",
        summary: "Pay for a booking",
        description:
          "Pays for a booking by submitting a card or bank account payment source.",
        tags: ["Payments"],
        protect: true,
      },
    })
    .input(
      BookingPaymentInputSchema.extend({
        bookingId: z.string().uuid().describe("The ID of the booking"),
      })
    )
    .output(BookingPaymentSchema)
    .mutation(async ({ input }) => {
      const { bookingId, ...paymentInput } = input;
      const booking = await db.booking.findById(bookingId);
      if (!booking)
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      const payment = await db.payment.create(bookingId, paymentInput);
      return payment;
    }),
});

export type AppRouter = typeof appRouter;
