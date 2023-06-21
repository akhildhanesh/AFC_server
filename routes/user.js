import express from 'express'
import { addUserKey, updateUserKey } from '../db/mongo.js'

const router = express.Router()

router.get('/', (req, res) => {
    return res.render('index')
})

router.post('/register-product', (req, res) => {
    addUserKey(req.body)
        .then(() => {
            return res.json({ status: 'Product Registered', ok: true })
        })
        .catch(e => {
            return res.status(500).json({ status: 'Please Check your Product ID', ok: false })
        })
})

router.get('/reregister-product', (req, res) => {
    return res.render('reregister.hbs')
})


router.post('/reregister-product', (req, res) => {
    updateUserKey(req.body)
        .then(() => {
            return res.json({ status: 'Updated', ok: true })
        })
        .catch(e => {
            return res.status(500).json({ status: 'Please Check your Product ID', ok: false })
        })
})

export {
    router
}