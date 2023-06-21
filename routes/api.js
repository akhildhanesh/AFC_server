import express from 'express'
import { getUserKey } from '../db/mongo.js'
import * as session from 'express-session'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const TOKEN = process.env.API_KEY

router.post('/messages.json', (req, res) => {
    let data = req.body
    getUserKey(data.uid)
        .then(({ key }) => {
            delete data.uid
            data = {
                token: TOKEN,
                user: key, ...data
            }
            axios.post('https://api.pushover.net/1/messages.json', data)
                .then(res => res.data)
                .then(data => {
                    if (data.status) {
                        return res.json({ status: 'Message Delivered' })
                    }
                })
                .catch(e => console.error(e.message))
        })
        .catch(e => {
            console.error(e)
            return res.json({ status: 'Message Failed' })
        })
})

export {
    router
}