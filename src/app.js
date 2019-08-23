const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const directoryLocation = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(directoryLocation))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Nathan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        src: '/img/ID.jpg',
        name: 'Denzel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Lhyniel'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}) => {
        if (error) {
            return res.send({error})
        }
    
        forecast(latitude, longitude, (error, data) => {
            if (error) {
                return res.send({error})
            }
            
            res.send({
                location: location,
                forecast: data,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nathan',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nathan',
        errorMessage: 'My 404 page'
    })
})

// app.use((req, res, next) => {
//     res.status(404).send("Sorry can't find that!")
// })

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})