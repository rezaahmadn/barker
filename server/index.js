const express = require('express')
const cors = require('cors')
const monk = require('monk')
const Filter = require('bad-words')
const rateLimit = require('express-rate-limit')


const app = express()

const db = monk('localhost/barker')
const barks = db.get('barks')
const filter = new Filter();

app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
  res.json({
    message:"haha"
  })
})

app.get('/barks', (req, res)=>{
  barks
    .find()
    .then(barks => {
      res.json(barks)
    })
})

function isValidBark(bark){
  return bark.name && bark.name.toString().trim() !== '' && 
    bark.content && bark.content.toString().trim() !== ''
}

app.use(rateLimit({
  windowMs: 5 * 1000,
  max: 1
}))

app.post('/barks', (req, res)=>{
  if (isValidBark(req.body)){
    const bark = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date()
    }
    barks
      .insert(bark)
      .then(createdBark => {
        res.json(createdBark)
      })
  } else {
    res.status(422)
    res.json({
      message:"Hey! Yang bener dong isinya!"
    })
  }
})

app.listen(5000, ()=>{
  console.log("Listening on http://localhost:5000");
})