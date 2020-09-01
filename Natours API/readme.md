# Flow Of developemnt

Create a import data script for Tour Model using tours-simple.json :clipboard:

## API Features ( query strings :mag: ): Get All Tours should support following query string

:rocket: `/api/v1/tours?duration=5&difficulty=easy` :clipboard:

:rocket: /api/v1/tours?duration[gte]=5&difficulty=easy :clipboard:

:rocket: /api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=5000 (comparison query operators) :clipboard:

:rocket: /api/v1/tours?sort=price :clipboard:

/api/v1/tours?sort=price,ratingsAverage (sort) :clipboard:

/api/v1/tours?fields=name,price,duration (field limiting) :clipboard:

/api/v1/tours?page=2&limit=20 (pagination) :memo:

Create a route /api/tours/top-5-cheap which returns all the top 5 cheap tours, with fields = name,difficulty,price,averageRating, summary :clipboard:

## Refactor API Features

Can you create a Class APIFeatures for sort,limit,pagination,limitFields and chain it on Model.find() like => Model.find().sort().limit()....... :clipboard:
