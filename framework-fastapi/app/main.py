"""Train Travel API example implemented with FastAPI."""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field
from scalar_fastapi import get_scalar_api_reference


class Station(BaseModel):
    id: UUID
    name: str
    address: str
    country_code: str
    timezone: str


class Trip(BaseModel):
    id: UUID
    origin: UUID
    destination: UUID
    departure_time: datetime
    arrival_time: datetime
    price: float
    operator: str
    bicycles_allowed: bool
    dogs_allowed: bool


class Booking(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    trip_id: UUID
    passenger_name: str
    has_bicycle: bool = False
    has_dog: bool = False


class PaymentStatus(str, Enum):
    pending = "pending"
    succeeded = "succeeded"
    failed = "failed"


class CardSource(BaseModel):
    object: str = "card"
    name: str
    number: str
    cvc: str = Field(min_length=3, max_length=4)
    exp_month: int
    exp_year: int
    address_country: str
    address_post_code: Optional[str] = None


class BankAccountSource(BaseModel):
    object: str = "bank_account"
    name: str
    number: str
    sort_code: Optional[str] = None
    account_type: str
    bank_name: str
    country: str


class BookingPayment(BaseModel):
    id: Optional[UUID] = None
    amount: float = Field(gt=0)
    currency: str
    source: CardSource | BankAccountSource
    status: Optional[PaymentStatus] = None


class CollectionLinks(BaseModel):
    self: str
    next: Optional[str] = None
    prev: Optional[str] = None


class StationCollection(BaseModel):
    data: List[Station]
    links: CollectionLinks


class TripWithLinks(Trip):
    links: dict[str, str]


class TripCollection(BaseModel):
    data: List[TripWithLinks]
    links: CollectionLinks


class BookingWithLinks(Booking):
    links: dict[str, str]


class BookingCollection(BaseModel):
    data: List[BookingWithLinks]
    links: CollectionLinks


class PaymentWithLinks(BookingPayment):
    links: dict[str, str]


tags_metadata = [
    {"name": "Stations", "description": "Find and filter train stations across Europe."},
    {"name": "Trips", "description": "Timetables and routes for train trips between stations."},
    {"name": "Bookings", "description": "Create and manage bookings for train trips."},
    {"name": "Payments", "description": "Pay for bookings and view payment status."},
]

app = FastAPI(
    title="Train Travel API",
    summary="Find and book train trips across Europe",
    description="API for finding and booking train trips across Europe.",
    version="1.2.1",
    servers=[
        {"url": "https://try.microcks.io/rest/Train+Travel+API/1.0.0", "description": "Mock Server"},
        {"url": "https://api.example.com", "description": "Production"},
    ],
    openapi_tags=tags_metadata,
)

STATIONS = [
    Station(id="efdbb9d1-02c2-4bc3-afb7-6788d8782b1e", name="Berlin Hauptbahnhof", address="Invalidenstrasse 10557 Berlin, Germany", country_code="DE", timezone="Europe/Berlin"),
    Station(id="b2e783e1-c824-4d63-b37a-d8d698862f1d", name="Paris Gare du Nord", address="18 Rue de Dunkerque 75010 Paris, France", country_code="FR", timezone="Europe/Paris"),
]
TRIPS = [
    Trip(id="ea399ba1-6d95-433f-92d1-83f67b775594", origin=STATIONS[0].id, destination=STATIONS[1].id, departure_time="2024-02-01T10:00:00Z", arrival_time="2024-02-01T16:00:00Z", price=50, operator="Deutsche Bahn", bicycles_allowed=True, dogs_allowed=True),
    Trip(id="4d67459c-af07-40bb-bb12-178dbb88e09f", origin=STATIONS[1].id, destination=STATIONS[0].id, departure_time="2024-02-01T12:00:00Z", arrival_time="2024-02-01T18:00:00Z", price=50, operator="SNCF", bicycles_allowed=True, dogs_allowed=True),
]
BOOKINGS = [Booking(id="1725ff48-ab45-4bb5-9d02-88745177dedb", trip_id=TRIPS[0].id, passenger_name="John Doe", has_bicycle=True, has_dog=True)]


def page_links(path: str, page: int) -> CollectionLinks:
    return CollectionLinks(self=f"https://api.example.com/{path}?page={page}", next=f"https://api.example.com/{path}?page={page + 1}", prev=f"https://api.example.com/{path}?page={page - 1}" if page > 1 else None)


def booking_links(booking_id: UUID) -> dict[str, str]:
    return {"self": f"https://api.example.com/bookings/{booking_id}"}


@app.get("/scalar", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(openapi_url=app.openapi_url, title=app.title + " - Scalar")


@app.get("/stations", response_model=StationCollection, tags=["Stations"], operation_id="get-stations")
def get_stations(page: int = Query(1, ge=1), search: Optional[str] = None, country: Optional[str] = None):
    stations = STATIONS
    if search:
        stations = [station for station in stations if search.lower() in station.name.lower() or search.lower() in station.address.lower()]
    if country:
        stations = [station for station in stations if station.country_code == country]
    return StationCollection(data=stations, links=page_links("stations", page))


@app.get("/trips", response_model=TripCollection, tags=["Trips"], operation_id="get-trips")
def get_trips(origin: UUID, destination: UUID, date: datetime, bicycles: bool = False, dogs: bool = False, page: int = Query(1, ge=1)):
    trips = [trip for trip in TRIPS if trip.origin == origin and trip.destination == destination]
    if bicycles:
        trips = [trip for trip in trips if trip.bicycles_allowed]
    if dogs:
        trips = [trip for trip in trips if trip.dogs_allowed]
    data = [TripWithLinks(**trip.model_dump(), links={"self": f"https://api.example.com/trips/{trip.id}", "origin": f"https://api.example.com/stations/{trip.origin}", "destination": f"https://api.example.com/stations/{trip.destination}"}) for trip in trips]
    return TripCollection(data=data, links=page_links("trips", page))


@app.get("/bookings", response_model=BookingCollection, tags=["Bookings"], operation_id="get-bookings")
def get_bookings(page: int = Query(1, ge=1)):
    data = [BookingWithLinks(**booking.model_dump(), links=booking_links(booking.id)) for booking in BOOKINGS]
    return BookingCollection(data=data, links=page_links("bookings", page))


@app.post("/bookings", response_model=BookingWithLinks, status_code=status.HTTP_201_CREATED, tags=["Bookings"], operation_id="create-booking")
def create_booking(booking: Booking):
    BOOKINGS.append(booking)
    return BookingWithLinks(**booking.model_dump(), links=booking_links(booking.id))


@app.get("/bookings/{booking_id}", response_model=BookingWithLinks, tags=["Bookings"], operation_id="get-booking")
def get_booking(booking_id: UUID):
    booking = next((item for item in BOOKINGS if item.id == booking_id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingWithLinks(**booking.model_dump(), links=booking_links(booking.id))


@app.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Bookings"], operation_id="delete-booking")
def delete_booking(booking_id: UUID):
    for index, booking in enumerate(BOOKINGS):
        if booking.id == booking_id:
            BOOKINGS.pop(index)
            return None
    raise HTTPException(status_code=404, detail="Booking not found")


@app.post("/bookings/{booking_id}/payment", response_model=PaymentWithLinks, tags=["Payments"], operation_id="create-booking-payment")
def create_booking_payment(booking_id: UUID, payment: BookingPayment):
    if not any(booking.id == booking_id for booking in BOOKINGS):
        raise HTTPException(status_code=404, detail="Booking not found")
    source = payment.source.model_copy(deep=True)
    source.number = "************" + source.number[-4:]
    result = payment.model_copy(update={"id": uuid4(), "source": source, "status": PaymentStatus.succeeded})
    return PaymentWithLinks(**result.model_dump(), links={"booking": f"https://api.example.com/bookings/{booking_id}"})


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(title=app.title, version=app.version, summary=app.summary, description=app.description, servers=app.servers, routes=app.routes, tags=app.openapi_tags)
    schema["x-speakeasy-retries"] = {
        "strategy": "backoff",
        "backoff": {"initialInterval": 500, "maxInterval": 60000, "maxElapsedTime": 3600000, "exponent": 1.5},
        "statusCodes": ["5XX"],
        "retryConnectionErrors": True,
    }
    schema["components"]["securitySchemes"] = {
        "OAuth2": {
            "type": "oauth2",
            "flows": {
                "authorizationCode": {
                    "authorizationUrl": "https://example.com/oauth/authorize",
                    "tokenUrl": "https://example.com/oauth/token",
                    "scopes": {"read": "Read access", "write": "Write access"},
                }
            },
        }
    }
    schema["security"] = [{"OAuth2": ["read"]}]
    app.openapi_schema = schema
    return schema


app.openapi = custom_openapi
