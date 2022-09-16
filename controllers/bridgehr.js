var express = require('express');
var Axios = require('axios');
var router = express.Router();

router.post('/', function (req, res) {
    const data = req.body;
    const { tournamentId } = data;

    Axios.get("http://bridge.hr/api/tournaments/" + tournamentId).then((pageResp) => {
        res.json(pageResp.data)
    })  .catch(function (error) {
        // if (error.response) {
        //   // The request was made and the server responded with a status code
        //   // that falls out of the range of 2xx
        //   console.log(error.response.data);
        //   console.log(error.response.status);
        //   console.log(error.response.headers);
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //   // http.ClientRequest in node.js
        //   console.log(error.request);
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   console.log('Error', error.message);
        // }
        // console.log(error.config);
        res.json({
            status: 404,
            data: {
                handRecords: []
            },
            error: "Failed to get tournament response." 
        });

      });
    
});

module.exports = router;
