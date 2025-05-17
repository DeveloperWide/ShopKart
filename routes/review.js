const express = require("express");
const router = express.Router({mergeParams: true});

router.get("/", (req, res) => {
    let {id} = req.params;
    console.log(id)
})

module.exports = router;