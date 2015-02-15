phantom=require 'phantom'
redis = require('redis').createClient()

scheduleDirtyFlagKey='schedule:isdirty'
headlessUrl="http://127.0.0.1:3434/headless"

generatePic=()->

	# console.log "try get dirty key value"
	redis.get scheduleDirtyFlagKey,(err,isdirty)->
		# console.log isdirty
		if isdirty is "true"
			phantom.create (ph)->
				ph.createPage (page)->
					page.open headlessUrl,(status)->
						page.render('static_content/schedule.png')
						console.log "Output on "+ new Date()
						redis.set(scheduleDirtyFlagKey,false)

setInterval generatePic,5000
