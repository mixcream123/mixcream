const express = require("express");
const router = express.Router();
const APIClient = require("../controller/clientController");


//User Page
router.get("/",(req, res)=>{
    res.render("homePage");
})

//Check mã đơn hàng
router.get("/checkMDH", (req, res)=>{
    res.render("checkMDH");
})

router.post("/check", APIClient.check);

module.exports = router;