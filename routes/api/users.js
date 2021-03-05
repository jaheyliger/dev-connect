const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User')

//@route   POST api/users
//@desc    Register User
//@access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more charaters').isLength({ min: 6 })
],
async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
    //see if user exists
    let user = await User.findOne({ email })
    if(user){
        res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    //get users gravatar
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    })
    user = new User({
        name,
        email,
        avatar,
        password
    })
    
    //encrypt password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    //return json web token
    const payload = {
        user: {
            id: user.id
        }
    }
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        {expiresIn: 3600000},
        (err, token) => {
            if(err) throw err
            res.json({ token })
        }
    )
    
    }catch(err){
        console.log(err.message) //log the error message
        res.status(500).send('Server error')//send a 500 status error message
    }
})

module.exports = router