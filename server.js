const express = require('express') //bring in express
const connectDB = require('./config/db')
const app = express(); //initialize express server

//connect database
connectDB()

//Init Middleware
app.use(express.json({ extended: false}))

//get a request and response
//respond to the server ("API RUNNING")
app.get('/',(req, res) => res.send('API Running'))

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/post', require('./routes/api/post'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))//listen for server on port xxxx



