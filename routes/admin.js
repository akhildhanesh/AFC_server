import express from 'express'
import { compare } from 'bcrypt'
import { getAdmin, generateUID } from '../db/mongo.js'

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false}))

router.post('/', (req, res) => {
    if (req.body.username === '' || req.body.password === '') {
        return res.redirect('/admin')
    }
    getAdmin()
        .then(db => {
            let username = req.body.username
            let password = req.body.password
            if (db.user === username) {
                compare(password, db.password, (err, result) => {
                    if (err) return res.render('admin_error_login')
                    if (result) {
                        req.session.AdminLoggedIn = true
                        return res.redirect('/admin')
                    } else {
                        return res.render('admin_error_login')
                    }
                })
            } else {
                return res.render('admin_error_login')
            }
        })
        .catch(err => console.log(err.message))
})

router.use('/*', (req, res, next) => {
    if (req.session.AdminLoggedIn) {
        next()
    } else {
        res.render('admin_login')
    }
})

router.get('/', (req, res) => {
    res.render('uid_generator', { admin: true })
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
})

router.get('/generateUID', (req, res) => {
    const timeStamp = new Date()
    generateUID(timeStamp)
        .then(uid => {
            return res.json({ status: 'Successfully Generated UID', uid })
        })
        .catch(() => {
            return res.json({ status: 'Failed to Generate UID' })
        })
})

export {
    router
}