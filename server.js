// this is the server
const express = require('express');
const app = express();

let cities = [
    {
        name: 'Berlin',
        country: 'Germany'
    },
    {
        name: 'Hamburg',
        country: 'Germany'
    }
];
app.use(express.static('./public'));

app.get("/get-cities", (req,res) => {
  console.log('you did it');
  res.json(cities);
})

app.listen(8080, ()=> console.log('SERVER ONLINE'))
