var express = require('express');
var router = express.Router();

router.post('/todo/create', function(req,res){
    // req.body
    var post = JSON.parse(req.body);
    console.log(post.email)
    res.send(post.email)
});

module.export = router;