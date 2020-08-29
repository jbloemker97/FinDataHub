const express = require('express');
const router = express.Router();
const makeDb = require('../db');
const Controller = require('./users-controller')({ makeDb });


router.post('/signup', async function (req, res) {
 
        let response = await Controller.signUp({ email: req.body.email, password: req.body.password, confirmPassword: req.body.confirmPassword, subscription: req.body.subscription });
        
        // Set Headers
        if (response.headers) {
            res.set(response.headers)
        }

        // Send Reponse
        res.status(response.statusCode).send(response);
});

router.post('/login', async function (req, res) {
    
        let response = await Controller.login({ email: req.body.email, password: req.body.password });
        
       // Set Headers
        if (response.headers) {
            res.set(response.headers)
        }

        // Send Reponse
        res.status(response.statusCode).send(response);
});

router.post('/update', async function (req, res) {
   
    let response = await Controller.updateUser({ email: req.body.email, password: req.body.password, confirmPassword: req.body.confirmPassword, subscription: req.body.subscription });
    
    // Set Headers
    if (response.headers) {
        res.set(response.headers)
    }

    // Send Reponse
    res.status(response.statusCode).send(response);
});

module.exports = router;