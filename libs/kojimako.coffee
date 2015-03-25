restify=require 'restify'
jade = require 'jade'
request=require 'request'
_ = require 'underscore'

class Kojimako
  constructor: (@miki) ->

    # update schedule entity
    @updateSchedule=(req,res,next)=>

      if req.params.token != @miki.config.token
        res.send(401,"{error: 'wrong token'}")
      else
        @miki.setSchedule(req.params)

      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      res.end("errcode:0")

    @getSchedules =(req,res,next)=>
      respList=@miki.getSchedules().map (s)->
        begin:s.begin
        end:s.end
        description:s.description
        duration:s.duration
        detail:s.detail
        order:s.order


      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      res.end(JSON.stringify(respList))

    @getRooms= (req,res,next)=>
      roomList=_.chain @miki.getRooms()
        .filter (r)->
          if r.disabled is false
            if (r.always_show is true or r.show_status is 1)
              true
        .sortBy (r)-> -r.fans
        .map (r)->
          # r.room_name="#{r.room_name} (#{r.online})"
          picked=_.pick(r,'room_id','show_status',
          'show_details','show_time',
          'room_name','room_src',
          'owner_uid','fans','online')
          picked.room_name="#{r.room_name} (#{r.online})"
          return picked
        .value()



      res.setHeader 'Access-Control-Allow-Origin','*'
      res.setHeader 'Content-Type','application/json; charset=utf-8'
      res.end(JSON.stringify(roomList))

    @getSnapImage =(req,res,next)=>

      douyuUrl=@miki.config.douyuWebPicUrl+req.url.replace("snap/","")

      options=
        hostname:'staticlive.douyutv.com'
        port:80
        path:douyuUrl
        method:'GET'

      res.setHeader 'Access-Control-Allow-Origin','*'
      request.get(douyuUrl).pipe(res)

    @getAvatarImage =(req,res,next)->

      avatarUrl="#{@miki.config.douyuAvatarAPI}?uid=#{req.params.uid}&size=big"

      options=
        hostname:'uc.douyutv.com'
        port:80
        path:avatarUrl
        method:'GET'

      res.setHeader 'Access-Control-Allow-Origin','*'
      request.get(avatarUrl).pipe(res)


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

    server.get('/api/list',@getSchedules)
    server.get('/api/room',@getRooms)

    server.get('/headless',@renderHeaderless)

    #
    # console.log "snap loaded"
    server.get('/snap/.*',@getSnapImage)
    server.get('/avatar/:uid',@getAvatarImage)

    server.get('/'+@miki.config.managePath,@renderManage)
    server.get('/',@renderIndex)


    server.get /.*/,restify.serveStatic
      'directory': 'static_content'
      'default': '../index.html'
      'maxAge': 43200

    server.listen @miki.config.port,()=>
      console.log "server started:"
      console.log "http://#{@miki.config.host}:#{@miki.config.port}/"



module.exports = Kojimako
