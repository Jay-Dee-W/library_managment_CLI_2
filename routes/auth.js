
const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')

const storage = multer.diskStorage({
    destination: function (_,_,cb) {
        cb(null, "static/images/")
    },
    filename: function (_, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const multipart = multer({storage: storage})

const router = express.Router()
const userController = require('../controllers/userController')

router.post("/signup", multipart.single("profilePic"), async (req, res) => {
        if (req.file.path){
            req.body.photoUrl = req.file.path;
        } else {
            req.body.photoUrl = "http://"
        }
        let result = await userController.addNewUser(req.body)
        console.log('result',result )
        if ( result.status) {
            res.status(201).send( result.result)
        } else 
        res.status(400).send(result.result)
    });


router.post("/login", async (req, res) => {
    
    const loginResult =  await userController.loginUser(req.body)
    if (loginResult.status) {
        let payload = {
            email: loginResult.result.email,
            iat : Date.now()
        }
        let token =  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
        console.log(token)
        res.status(200).json({'access_token': token})
    }else {
        res.status(400).json(loginResult.result)
    }
});


module.exports = router