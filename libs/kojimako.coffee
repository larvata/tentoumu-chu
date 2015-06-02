restify=require 'restify'
jade = require 'jade'
request=require 'request'
_ = require 'underscore'
moment = require 'moment'

class Kojimako
  constructor: (@miki) ->
    miki=@miki

    # update schedule entity
    @updateSchedule=(req,res,next)=>

      if req.params.token != @miki.config.token
        res.send(401,"{error: 'wrong token'}")
      else
        @miki.setSchedule(req.params)

      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      res.end("errcode:0")

    # obsolete:
    @getSchedules =(req,res,next)->
      # respList=@miki.getSchedules().map (s)->
      #   begin:s.begin
      #   end:s.end
      #   description:s.description
      #   duration:s.duration
      #   detail:s.detail
      #   order:s.order

      # res.setHeader 'Access-Control-Allow-Origin','*'
      # res.setHeader 'Content-Type','application/json; charset=utf-8'
      # res.end(JSON.stringify(respList))

      console.log "in getSchedules(old)"
      schedule = miki.getSchedule()

      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      # todo: stringify is necessary
      respList = _.chain schedule
        .filter (p)->
          if p.roomId is '' then false else true
        .map (p)->
          begin:"#{p.month}/#{p.day} #{p.roomTitle}"
          end: "#{p.start}～#{p.end}"
          description:p.title
          detail:''
          order:1
        .value()

        res.end(JSON.stringify(respList))


    @getSchedule=(req,res,next)->
      console.log "in getSchedule"
      schedule = miki.getSchedule()

      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      # todo: stringify is necessary
      res.end(JSON.stringify(schedule))

    @getRooms= (req,res,next)=>
      roomList=_.chain @miki.getRooms()
        .filter (r)->
          if r.disabled is false
            if (r.always_show is true or r.show_status is 1)
              true
        # .sortBy (r)-> r.live_provider
        .sortBy (r)-> -r.fans
        .map (r)->
          # r.room_name="#{r.room_name} (#{r.online})"
          picked=_.pick(r,'room_id','show_status',
          'show_details','show_time',
          'room_name','live_snapshot',
          'owner_avatar','fans','online','live_provider','room_url')
          picked.room_name="#{r.room_name}"
          return picked
        .value()



      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      res.end(JSON.stringify(roomList))

    @getDouyuSnapImage =(req,res,next)=>

      # console.log "snap provider douyu"
      douyuUrl=@miki.config.douyuWebPicUrl+req.url.replace('snap/douyu/','')
      # console.log douyuUrl
      # headers=
      #   'Accept':'application/json, text/plain, */*'
      #   'Accept-Encoding':'gzip, deflate, sdch'
      #   'Accept-Language':'en-US,en;q=0.8'
      #   'Cache-Control':'no-cache'
      #   'Connection':'keep-alive'
      #   'Host':'staticlive.douyutv.com'
      #   'Pragma':'no-cache'
      #   'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.2 Safari/537.36'

      # options=
      #   url:douyuUrl
      #   headers:headers

      options=@miki.createRequestOptions(douyuUrl,'staticlive.douyutv.com')

      res.setHeader 'Access-Control-Allow-Origin','*'

      req=request(options)
      req.on 'response',(resp)->
        if resp.statusCode isnt 200
          console.log options.url
          console.log resp.statusCode
      req.pipe(res,{end:true})

    @getZhanqiSnapImage =(req,res,next)=>

      # console.log "snap provider #{req.params.provider}"
      zhanqiUrl=@miki.config.zhanqiWebPicUrl+req.url.replace('snap/zhanqi/','')
      # console.log zhanqiUrl
      # headers=
      #   'Accept':'application/json, text/plain, */*'
      #   'Accept-Encoding':'gzip, deflate, sdch'
      #   'Accept-Language':'en-US,en;q=0.8'
      #   'Cache-Control':'no-cache'
      #   'Connection':'keep-alive'
      #   'Host':'dlpic.cdn.zhanqi.tv'
      #   'Pragma':'no-cache'
      #   'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.2 Safari/537.36'

      # options=
      #   url:zhanqiUrl
      #   headers:headers
      options=@miki.createRequestOptions(zhanqiUrl,'dlpic.cdn.zhanqi.tv')
# "http://dlpic.cdn.zhanqi.tv/live/20150419/33967_5hpHI_2015-04-19-19-59-35_big.jpg"
      res.setHeader 'Access-Control-Allow-Origin','*'

      req=request(options)
      req.on 'response',(resp)->
        if resp.statusCode isnt 200
          console.log options.url
          console.log resp.statusCode
      req.pipe(res,{end:true})

    @getDouyuAvatarImage =(req,res,next)=>
      # console.log req.url
      # console.log req.url.replace('avatar/douyu/','')
      avatarUrl=@miki.config.douyuAvatarAPI+req.url.replace('/avatar/douyu/','')
      # options=
      #   hostname:'uc.douyutv.com'
      #   port:80
      #   path:avatarUrl
      #   method:'GET
      # console.log avatarUrl

      # headers=
      #   'Accept':'application/json, text/plain, */*'
      #   'Accept-Encoding':'gzip, deflate, sdch'
      #   'Accept-Language':'en-US,en;q=0.8'
      #   'Cache-Control':'no-cache'
      #   'Connection':'keep-alive'
      #   'Host':'uc.douyutv.com'
      #   'Pragma':'no-cache'
      #   'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.2 Safari/537.36'

      # options=
      #   url:avatarUrl
      #   headers:headers

      options=@miki.createRequestOptions(avatarUrl,'uc.douyutv.com')


      res.setHeader 'Access-Control-Allow-Origin','*'
      req=request(options)
      req.on 'response',(resp)->
        if resp.statusCode isnt 200
          console.log options.url
          console.log resp.statusCode
      req.pipe(res)

    @getZhanqiAvatarImage =(req,res,next)=>

      avatarUrl=@miki.config.zhanqiAvatarAPI+req.url.replace('avatar/zhanqi/','')+"-big"
      # options=
      #   hostname:'uc.douyutv.com'
      #   port:80
      #   path:avatarUrl
      #   method:'GET'
      # console.log avatarUrl

      # headers=
      #   'Accept':'application/json, text/plain, */*'
      #   'Accept-Encoding':'gzip, deflate, sdch'
      #   'Accept-Language':'en-US,en;q=0.8'
      #   'Cache-Control':'no-cache'
      #   'Connection':'keep-alive'
      #   'Host':'pic.cdn.zhanqi.tv'
      #   'Pragma':'no-cache'
      #   'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.2 Safari/537.36'

      # options=
      #   url:avatarUrl
      #   headers:headers

      options=@miki.createRequestOptions(avatarUrl,'pic.cdn.zhanqi.tv')

      res.setHeader 'Access-Control-Allow-Origin','*'
      req=request(options)
      req.on 'response',(resp)->
        if resp.statusCode isnt 200
          console.log options.url
          console.log resp.statusCode
      req.pipe(res)


    @renderIndex =(req,res,next)=>
      console.log 'render index'
      schedules=@miki.getSchedules()
      html=jade.renderFile('templates/index.jade',{schedules})
      res.end(html)


    @renderManage =(req,res,next)=>
      console.log "rendermanage"
      schedules=@miki.getSchedules()
      html=jade.renderFile('templates/manage.jade',{schedules})

      res.setHeader 'Content-Type','text/html'
      res.writeHead 200
      res.end(html)

    @renderHeaderless =(req,res,next)=>
      schedules=@miki.getSchedules()
      html=jade.renderFile('templates/headless.jade',{schedules})
      res.setHeader 'Content-Type','text/html'
      res.writeHead 200
      res.end(html)


  startServer: ()->

    page404 ='../static_content/404.html'
    server=restify.createServer
      formatters:
        'text/html': (req,res,body)->
          if res.statusCode is 404
            stat = fs.statSync(page404)
            res.cache({maxAge: 43200})
            res.set('Content-Length', stat.size)
            res.set('Last-Modified', stat.mtime)
            fs.readFileSync(page404,{'encoding':'utf8'})

    server.use restify.queryParser()
    server.use restify.bodyParser()


    # API definiation
    server.post('/api/list/:token',@updateSchedule)
    server.get('/api/list/:token',@getSchedules)

    # OBSOLTE when new api statable
    server.get('/api/list',@getSchedules)
    server.get('/api/room',@getRooms)

    server.get("/api/#{@miki.config.apiVersions.v1}/schedule",@getSchedule)
    server.get("/api/#{@miki.config.apiVersions.v1}/room",@getRooms)

    server.get('/headless',@renderHeaderless)

    #
    # console.log "snap loaded"
    server.get('/snap/douyu/.*',@getDouyuSnapImage)
    server.get('/snap/zhanqi/.*',@getZhanqiSnapImage)
    server.get('/avatar/douyu/.*',@getDouyuAvatarImage)
    server.get('/avatar/zhanqi/.*',@getZhanqiAvatarImage)


    server.get('/'+@miki.config.managePath,@renderManage)
    server.get('/',@renderIndex)


    server.get /.*/,restify.serveStatic
      'directory': 'static_content'
      'default': '../index.html'
      'maxAge': 43200

    server.listen @miki.config.port,()=>
      console.log "[kojimako] server started:"
      console.log "[kojimako] http://#{@miki.config.host}:#{@miki.config.port}/"



module.exports = Kojimako
