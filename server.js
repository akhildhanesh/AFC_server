import express from 'express'
import * as session from 'express-session'
import { router as user } from './routes/user.js'
import { router as api } from './routes/api.js'
import { router as admin } from './routes/admin.js'


const app = express()
const PORT = process.env.PORT || 3003

app.use(express.json())
app.use(express.static('public'))

app.use(session.default({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 3.6e+6
    },
    resave: true,
    saveUninitialized: true
}))

app.set('view engine', 'hbs')

app.use('/', user)
app.use('/api', api)
app.use('/admin', admin)

app.get('*', (req, res) => {
    res.render('404')
})

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})