import { Request, Response, response, Router } from 'express'
import User, { IUser } from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config/keys'

import passport from 'passport'
import '../config/passport'
import Task, { ITask } from '../models/Task'
const usersRouter = Router()

usersRouter.post('/register', (request: Request, response: Response) => {
  try {
    const { email, password } = request.body
    if (email && password) {
      User.findOne({ email }).then(async (user: IUser) => {
        if (user) {
          return response
            .status(400)
            .json({ errorMessage: 'User with email Already exists', user })
        } else {
          let user: IUser = new User({
            email,
            password,
          })
          await user.save().then((r) => {
            console.log('Response from db', r)
          })
        }
      })
    } else {
      return response.status(400).json({ errorMessage: 'Validation Error' })
    }
  } catch (e) {
    return response.status(500).json({ errorMessage: 'Internal server error' })
  }
})

usersRouter.post('/login', (request: Request, response: Response) => {
  try {
    const { email, password } = request.body
    if (email && password) {
      User.findOne({ email }).then(async (user: IUser) => {
        if (user) {
          if (user.password === password) {
            const paylaod = {} //create jwt payload

            //sign token
            jwt.sign(
              { user },
              config.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                response.json({
                  success: true,
                  token: 'Bearer ' + token,
                })
              }
            )
          }
        } else {
          return response.status(400).json({
            errorMessage: 'User with email does not exists',
          })
        }
      })
    } else {
      return response.status(400).json({ errorMessage: 'Validation Error' })
    }
  } catch (e) {
    return response.status(500).json({ errorMessage: 'Internal server error' })
  }
})
usersRouter.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  (request: Request, response: Response) => {
    try {
      const user: any = request.user
      response.json({ user: { id: user?._id, email: user?.email } })
    } catch (error) {
      response
        .status(500)
        .json({ errorMessage: 'Internel server error', error })
    }
  }
)

usersRouter.post(
  '/create-task',
  passport.authenticate('jwt', { session: false }),
  async (request: Request, response: Response) => {
    try {
      const { name } = request.body
      if (name) {
        let task: ITask = new Task({
          name,
        })
        await task.save().then((task: ITask) => {
          response
            .status(200)
            .json({ message: 'Task added successfully', task })
        })
      } else {
        response.status(401).json({ errorMessage: 'Validation error ' })
      }
    } catch (error) {
      response
        .status(500)
        .json({ errorMessage: 'Internel server error', error })
    }
  }
)

usersRouter.get(
  '/list-tasks',
  passport.authenticate('jwt', { session: false }),
  async (request: Request, response: Response) => {
    try {
      Task.find().then((taskArray: any) => {
        if (taskArray) {
          response.status(200).json({ tasks: taskArray })
        } else {
          response.status(400).json({ errorMessage: 'No Tasks Found' })
        }
      })
    } catch (error) {
      response
        .status(500)
        .json({ errorMessage: 'Internel server error', error })
    }
  }
)

export default usersRouter
