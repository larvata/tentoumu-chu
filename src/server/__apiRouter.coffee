miki = require '../services/miki'
express = require 'express'

router = express.Router()


router.route("/#{miki.config.apiVersions.v1}/schedule").get((req,res)->
  res.json(miki.getSchedule())
)


module.exports = router
