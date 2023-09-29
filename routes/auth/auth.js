const { register, checkauth, login } = require('../../controllers/auth/auth')
const verifyToken = require('../../middleware/verifyToken')
const router = require('express').Router()


router.post("/register", register  )
router.post("/signup" , login )  
router.get("/checkauth", verifyToken , checkauth )




module.exports = router