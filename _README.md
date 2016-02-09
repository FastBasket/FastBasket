# FastBasket

## Same-day grocery delivery ##

## Table of Contents

## Summary ##
  FastBasket provides the most convenient grocery shopping experience. Order groceries online and track your deliveries with just a few clicks. You'll never need worry about the transportation logistics. You'll also get plenty of food recommendations to help you build delicious recipes.


1. [Press Release](#press-release)
    1. [Problem](#problem)
    1. [Solution](#solution)
    1. [Team](#team)
1. [Development](#development)
    1. [Requirements](#requirements)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Necessary Environment Variables](#necessary-environment-variables)
    1. [Populating Databases](#populating-databases)
1. [Architecture](#architecture)

## Press Release

### Problem
  Grocery shopping is a chore. We lose [amount of time] every week navigating a maze of store aisles, trying to remember what to buy, then moving through lines and traffic. FaskBasket helps you get the foods you love without those hassles.

### Solution
  FaskBasket will help you simplify your grocery shopping experience in three ways:
    1 Search engines immediately locate any foods you are looking for.
    2 Context-aware recommenders figure out exactly what you need.
    3 Vehicle routing algorithms eliminate any traveling and traffic.
    4 Real-time systems offer gps tracking and text-message updates.
    5 Transaction log offer analytics in your purchase patterns


### How to Get Started
  Select your favorite grocery store and start filling up your cart. Our user interface will guide you through the payment and order status updates.


### Team

  - __Product Owner__: Dima Korenblyum
  - __Scrum Master__: Cristian Peñarrieta
  - __Development Team Members__: Ron Lapushner, Albert Tsou

## Development

### Requirements

- Node 5.5.x
- Redis 3.0.x
- Postgresql 9.5.x
- Elasticsearch 2.2.x
- Neo4j 2.3.x
- RabbitMQ 3.6.x

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Necessary Environment Variables

```sh
- TWILIO_SID=
- TWILIO_TOKEN=
- STRIPE_PUBLIC_KEY=
- STRIPE_SECRET_KEY=
- FACEBOOK_APP_ID=
- FACEBOOK_APP_SECRET=
```

### Populating Databases

```sh
  node server/db/dbScript/app.js
  node rec/recScript/index.js
```

## Architecture
