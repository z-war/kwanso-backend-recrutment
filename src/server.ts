import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import config from './config/keys'
import usersRoutes from './routes/users'
const app: Application = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose
  .connect(config.mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log(err))
app.use('/', usersRoutes)

app.listen(5000, () => {
  console.log('Server running ')
})
