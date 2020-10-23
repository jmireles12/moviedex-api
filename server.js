require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet())
app.use(cors())

app.use(function validateBeareToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    console.log(apiToken);

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

function handleGetMovie(req, res) {

    /* const list = movies.forEach(movie => console.log(movie)) */

    let response = movies.movies

    if(req.query.genre) {
        response = response.filter(movies => movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if(req.query.country) {
        response = response.filter(movies => movies.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if(req.query.avg_vote) {
        response = response.filter(movies => movies.avg_vote >= req.query.avg_vote)
    }

    res.json(response);

}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})