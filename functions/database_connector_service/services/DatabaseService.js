const Mysql = require('mysql')
const Postgres = require('pg')

class DatabaseService {
  #dbms = ''
  #host = ''
  #database = ''
  #username = ''
  #password = ''
  #validDbms = {
    Mysql: 'MYSQL',
    PostGres: 'POSTGRES'
  }

  #validOperations = ['SELECT']

  constructor (dbms, host, database, username, password) {
    this.#dbms = dbms
    this.#host = host
    this.#database = database
    this.#username = username
    this.#password = password
  }

  getValidDBMS = () => {
    return Object.values(this.#validDbms)
  }

  isValidDBMS = (dbms) => {
    return Object.values(this.#validDbms).includes(dbms)
  }

  isValidQuery = (query) => {
    const operation = query.trim().split(' ')[0]
    return this.#validOperations.includes(operation.toUpperCase())
  }

  executeQuery = async (query) => {
    switch (this.#dbms) {
      case this.#validDbms.PostGres: {
        const postgresClient = new Postgres.Client({
          host: this.#host,
          password: this.#password,
          database: this.#database,
          user: this.#username,
          connectionTimeoutMillis: 10000
        })

        await new Promise((resolve, reject) =>
          postgresClient.connect((err) => {
            if (err) {
              reject(err)
            }

            resolve('')
          })
        )
        return new Promise((resolve, reject) =>
          postgresClient.query(query, (err, data) => {
            if (err) {
              return reject(err)
            }

            resolve(data)
          })
        )
      }

      default: {
        const mysqlClient = Mysql.createConnection({
          host: this.#host,
          password: this.#password,
          database: this.#database,
          user: this.#username
        })

        await new Promise((resolve, reject) =>
          mysqlClient.connect((err) => {
            if (err) {
              reject(err)
            }

            resolve('')
          })
        )

        return new Promise((resolve, reject) =>
          mysqlClient.query(query, (err, data) => {
            if (err) {
              return reject(err)
            }

            resolve(data)
          })
        )
      }
    }
  }
}

module.exports = DatabaseService
