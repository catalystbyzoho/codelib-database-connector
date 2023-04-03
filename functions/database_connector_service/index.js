const Express = require('express')

const AppConstants = require('./constants')

const { AuthService, DatabaseService } = require('./services')
const { AppError, ErrorHandler } = require('./utils')

const app = Express()
app.use(Express.json())

app.use((req, res, next) => {
  try {
    if (
      !AuthService.getInstance().isValidRequest(
        req.get(AppConstants.Headers.CodelibSecretKey)
      )
    ) {
      throw new AppError(
        401,
        "You don't have permission to perform this operation. Kindly contact your administrator for more details."
      )
    }

    next()
  } catch (err) {
    const { statusCode, ...others } = ErrorHandler.getInstance().processError(err)

    res.status(statusCode).send(others)
  }
})

app.post('/executeQuery', async (req, res) => {
  try {
    const dbms = process.env[AppConstants.Env.Dbms]
    const host = process.env[AppConstants.Env.Host]
    const database = process.env[AppConstants.Env.Database]

    const query = req.body.query
    const username = req.body.username
    const password = req.body.password

    const databaseService = new DatabaseService(
      dbms,
      host,
      database,
      username,
      password
    )

    if (!dbms) {
      throw new AppError(400, "'DBMS' cannot be empty.")
    } else if (!databaseService.isValidDBMS(dbms)) {
      throw new AppError(400, `'DBMS' should be any one of ${databaseService.getValidDBMS().join(',')} values.`
      )
    } else if (!host) {
      throw new AppError(400, "'HOST' cannot be empty.")
    } else if (!database) {
      throw new AppError(400, "'DATABASE' cannot be empty.")
    } else if (!username) {
      throw new AppError(400, "'username' cannot be empty.")
    } else if (!password) {
      throw new AppError(400, "'password' cannot be empty.")
    } else if (!query) {
      throw new AppError(400, "'query' cannot be empty.")
    } else if (!databaseService.isValidQuery(query)) {
      throw new AppError(
        400,
        "The given SQL operation in the 'query' is not supported."
      )
    }

    const data = await databaseService.executeQuery(query)
    res.status(200).send({
      status: 'success',
      data
    })
  } catch (err) {
    const { statusCode, ...others } = ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.all('*', function (_req, res) {
  res.status(404).send({
    status: 'failure',
    message: "We couldn't find the requested url."
  })
})

module.exports = app
