import type { Station, Trip, Booking, BookingPayment } from "./models";
import { z } from "zod";
import { BookingInputSchema, BookingPaymentInputSchema } from "./models";

const STATIONS: Station[] = [
  {
    id: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
    name: "Berlin Hauptbahnhof",
    address: "Invalidenstrasse 10557 Berlin, Germany",
    country_code: "DE",
    timezone: "Europe/Berlin",
  },
  {
    id: "b2e783e1-c824-4d63-b37a-d8d698862f1d",
    name: "Paris Gare du Nord",
    address: "18 Rue de Dunkerque 75010 Paris, France",
    country_code: "FR",
    timezone: "Europe/Paris",
  },
];

const TRIPS: Trip[] = [
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
  {
    id: "4d67459c-af07-40bb-bb12-178dbb88e09f",
    origin: "b2e783e1-c824-4d63-b37a-d8d698862f1d",
    destination: "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
    departure_time: "2024-02-01T12:00:00Z",
    arrival_time: "2024-02-01T18:00:00Z",
    price: 50,
    operator: "SNCF",
    bicycles_allowed: true,
    dogs_allowed: true,
  },
];

const BOOKINGS: Booking[] = [
  {
    id: "1725ff48-ab45-4bb5-9d02-88745177dedb",
    trip_id: "ea399ba1-6d95-433f-92d1-83f67b775594",
    passenger_name: "John Doe",
    has_bicycle: true,
    has_dog: true,
  },
];

type StationFilter = {
  search?: string;
  country?: string;
  page?: number;
};

type TripFilter = {
  origin: string;
  destination: string;
  date?: string;
  bicycles?: boolean;
  dogs?: boolean;
};

export const db = {
  station: {
    findAll: async (filter: StationFilter = {}) => {
      let data = [...STATIONS];
      if (filter.search)
        data = data.filter(
          (s) =>
            s.name.includes(filter.search!) ||
            s.address.includes(filter.search!)
        );
      if (filter.country)
        data = data.filter((s) => s.country_code === filter.country);
      return data;
    },
  },
  trip: {
    findAll: async (filter: TripFilter) => {
      let data = TRIPS.filter(
        (t) =>
          t.origin === filter.origin && t.destination === filter.destination
      );
      if (filter.bicycles) data = data.filter((t) => t.bicycles_allowed);
      if (filter.dogs) data = data.filter((t) => t.dogs_allowed);
      return data;
    },
  },
  booking: {
    findAll: async () => [...BOOKINGS],
    findById: async (id: string) => BOOKINGS.find((b) => b.id === id),
    create: async (input: z.infer<typeof BookingInputSchema>): Promise<Booking> => {
      const booking: Booking = {
        id: crypto.randomUUID(),
        trip_id: input.trip_id,
        passenger_name: input.passenger_name,
        has_bicycle: input.has_bicycle ?? false,
        has_dog: input.has_dog ?? false,
      };
      BOOKINGS.push(booking);
      return booking;
    },
    delete: async (id: string) => {
      const idx = BOOKINGS.findIndex((b) => b.id === id);
      if (idx !== -1) BOOKINGS.splice(idx, 1);
    },
  },
  payment: {
    create: async (
      bookingId: string,
      input: z.infer<typeof BookingPaymentInputSchema>
    ): Promise<BookingPayment> => {
      return {
        id: crypto.randomUUID(),
        amount: input.amount,
        currency: input.currency,
        status: "succeeded",
      };
    },
  },
};
