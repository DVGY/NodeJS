# Flow Of developemnt

Create a import data script for Tour Model using `dev-data/data/tours-simple.json` :clipboard:

#### API Features ( query strings :mag: ): Get All Tours should support following query string

:rocket: `javascript /api/v1/tours?duration=5&difficulty=easy`

:rocket: `/api/v1/tours?duration[gte]=5&difficulty=easy`

:rocket: `/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=5000` (comparison query operators)

:rocket: `/api/v1/tours?sort=price`

:rocket: `/api/v1/tours?sort=price,ratingsAverage` (sort)

:rocket: `/api/v1/tours?fields=name,price,duration` (field limiting)

:rocket: `/api/v1/tours?page=2&limit=20` (pagination)

:rocket: Create a route `/api/v1/tours/top-5-cheap` which returns all the top 5 cheap tours, with `fields = name,difficulty,price,averageRating, summary`

#### Refactor API Features

:rocket: Can you create a `Class APIFeatures` for `sort,limit,pagination,limitFields` and chain it on `Model.find()` like => `Model.find().sort().limit().......`
