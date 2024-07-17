# Weather App

This is a Node.js application built with TypeScript and Fastify that interacts with a weather API to fetch temperature data based on user-provided date and location parameters. The application efficiently handles API rate limits and data formatting and ensures data persistence using SQLite for caching.

## Requirements

- Node.js
- Docker

## Setup

### Running Locally

1. Clone the repository:

```bash
git clone https://github.com/VictorSieli/weather-api.git
cd weather-api
```

2. Install dependencies:

```bash
npm install
```

3. Initialize the database:

```bash
npm run database:init
```

4. Run the application

```bash
npm run start
```

The server will start on http://localhost:3000.

# Running with Docker

1. Build the Docker image:

```bash
docker build -t weather-api .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 weather-api
```

The server will start on http://localhost:3000.

# API Route

## Get Weather

URL: /weather
Method: GET
Query Parameters:

- city (string): The city to fetch the weather for.
- date (string): The date to fetch the weather for in ISO 8601 format.

### Example

```bash
GET /weather?city=London&date=2024-07-16
```

# Testing

## To run the tests:

```bash
npm test
```

# Assumptions

- The weather API may randomly return errors and might alternate unpredictably between Celsius and Fahrenheit temperature scales. The application handles these inconsistencies by converting the temperatures to both Celsius and Fahrenheit.
- The cache expiration is handled manually by checking the date and city for each request.

# Approach

- Caching: Implemented a caching solution using SQLite to avoid hitting the API rate limit. Cached temperature data by date and city. The cache expires appropriately to ensure data is not outdated.
- Error Handling: Implemented robust error handling for API rate limits, random errors, and data format issues.
