from typing import Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI(
    title="Train Travel API",
    description="A sample API for stations, trips, and bookings.",
    version="0.1.0",
    docs_url=None,
)


class Station(BaseModel):
    id: str = Field(
        ...,
        description="Unique station ID.",
        examples=["efdbb9d1-02c2-4bc3-afb7-6788d8782b1e"],
    )
    name: str = Field(
        ...,
        description="Station name.",
        examples=["Berlin Hauptbahnhof"],
    )
    country_code: str = Field(
        ...,
        description="ISO 3166-1 alpha-2 country code.",
        examples=["DE"],
    )
    timezone: str = Field(
        ...,
        description="IANA timezone of the station.",
        examples=["Europe/Berlin"],
    )


class Trip(BaseModel):
    id: str = Field(
        ...,
        description="Unique trip ID.",
        examples=["trip_001"],
    )
    origin: str = Field(
        ...,
        description="Origin station ID.",
        examples=["efdbb9d1-02c2-4bc3-afb7-6788d8782b1e"],
    )
    destination: str = Field(
        ...,
        description="Destination station ID.",
        examples=["b2e783e1-c824-4d63-b37a-d8d698862f1d"],
    )
    departure_time: str = Field(
        ...,
        description="Departure time in ISO 8601 format.",
        examples=["2026-08-24T08:15:00Z"],
    )
    arrival_time: str = Field(
        ...,
        description="Arrival time in ISO 8601 format.",
        examples=["2026-08-24T10:05:00Z"],
    )
    price: float = Field(..., description="Trip price in EUR.", examples=[89.0])


class Booking(BaseModel):
    id: str = Field(
        ...,
        description="Unique booking ID.",
        examples=["booking_123"],
    )
    trip_id: str = Field(
        ...,
        description="Trip ID for the travel segment.",
        examples=["trip_001"],
    )
    passenger_name: str = Field(
        ...,
        description="Passenger name on the booking.",
        examples=["Ada Lovelace"],
    )
    status: Literal["confirmed", "pending", "cancelled"] = Field(
        default="confirmed",
        description="Booking status.",
        examples=["confirmed"],
    )


@app.get("/stations", response_model=list[Station], tags=["Stations"])
def list_stations(
    country: str | None = Query(
        default=None,
        description="Filter stations by ISO 3166-1 alpha-2 country code.",
        examples=["DE"],
    )
) -> list[Station]:
    stations = [
        Station(
            id="efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
            name="Berlin Hauptbahnhof",
            country_code="DE",
            timezone="Europe/Berlin",
        ),
        Station(
            id="b2e783e1-c824-4d63-b37a-d8d698862f1d",
            name="Munich Central Station",
            country_code="DE",
            timezone="Europe/Berlin",
        ),
    ]

    if country is None:
        return stations

    return [station for station in stations if station.country_code == country]


@app.get("/trips", response_model=list[Trip], tags=["Trips"])
def list_trips() -> list[Trip]:
    return [
        Trip(
            id="trip_001",
            origin="efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
            destination="b2e783e1-c824-4d63-b37a-d8d698862f1d",
            departure_time="2026-08-24T08:15:00Z",
            arrival_time="2026-08-24T10:05:00Z",
            price=89.0,
        ),
        Trip(
            id="trip_002",
            origin="b2e783e1-c824-4d63-b37a-d8d698862f1d",
            destination="efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
            departure_time="2026-08-25T18:40:00Z",
            arrival_time="2026-08-25T20:30:00Z",
            price=94.5,
        ),
    ]


@app.post("/bookings", response_model=Booking, status_code=201, tags=["Bookings"])
def create_booking(booking: Booking) -> Booking:
    return booking


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
