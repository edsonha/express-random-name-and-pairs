# express-random-name-and-pairs

An Express CRUD app that returns random name and pairs for Q&A session in the classroom or forming pair-programming group. The app incorporates testing with supertest and validation using @hapi/joi

## Expectations

1. GET /name will return a random name. The name will not repeat until exhausted.
2. GET /pairs will return an array of pairs.
3. GET /names will return all the names available
4. POST /names will take in a JSON in the body and will add the name from the list of names.
5. DELETE /names will take in a JSON in the body and will remove the name from the list of names.
6. PUT /names will take in a JSON with an oldName and newName and will replace the oldName with the newName

## Start the app

```
  npm install
  npm run nodemon
```

## Run test

```
  npm run test
```

## Run test coverage

```
  npm run test coverage
```
