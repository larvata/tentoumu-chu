do ->

	token=''
	checkToken=()->
		token=$.cookie('token')
		if token is undefined or token is ''
			token=$('#token').val()
			$.cookie('token',token)

		if token != undefined and token.length>0
			$('.container .jumbotron.first').hide()
			$('.container .jumbotron.head').show()

	$('#saveToken').click ()->
		checkToken()

	checkToken()

	Schedule = Backbone.Model.extend
		defaults: ()->
		 {
			begin: null
			end: null
			duration: 0
			detail: ''
			order: Schedules.nextItem()
			done:()->
				return false
		}


	ScheduleList = Backbone.Collection.extend

		model: Schedule
		url: 'api/list/'+token

		nextItem: ()->
			if !@.length
				return 1
			return @.last().get('order')+1

		comparator: 'order'


	Schedules =new ScheduleList

	ScheduleView =Backbone.View.extend
		tagName: 'tr'

		template: _.template($('#item-template').html())

		events: {
			# 'dblclick .view' : 'edit'
			'click a.destroy': 'clear'
			'keypress .edit' : 'updateOnEnter'
			'blur .view'     : 'close'
			# 'click .view'    : 'edit'
			'focus .view'    : 'edit'

		}

		initialize: ()->
			@listenTo(@model,'change',@render)
			@listenTo(@model,'destroy',@remove)

		render: ()->
			@$el.html(@template(@model.toJSON()))
			@inputBegin= @$('.begin')
			@inputEnd= @$('.end')
			@inputDescription= @$('.description')

			return @

		edit: ()->
			@$el.addClass('editing')

		close: ()->
			setTimeout ()=>
				if @model.get('begin') != @inputBegin.val()
					@model.save {begin:@inputBegin.val()||''}

				if @model.get('end') != @inputEnd.val()
					@model.save {end:@inputEnd.val()||''}

				if @model.get('description') != @inputDescription.val()
					@model.save {description:@inputDescription.val()||''}
			, 1


			@$el.removeClass('editing')

		updateOnEnter: (e)->
			if e.keyCode is 13 
				@.close()

		clear: ()->
			@model.destroy()

	AppView = Backbone.View.extend
		el: $('#scheduleApp')

		events: {
			'keypress #new-schedule>td>input:last': "createOnEnter"
		}

		initialize: ()->
			@inputBegin= @$('#new-schedule>td>input.begin')
			@inputEnd= @$('#new-schedule>td>input.end')
			@inputDescription= @$('#new-schedule>td>input.description')

			@listenTo(Schedules, 'add',@addOne)
			@listenTo(Schedules, 'reset',@addAll)
			@listenTo(Schedules, 'all', @render)

			@main=$('#main')


			Schedules.fetch()


		render: ()->

		addOne: (schedule)->
			view =new ScheduleView({model:schedule})
			ele=view.render().el
			@$('#new-schedule').before(ele)



		addAll: ()->
			Schedules.each(@addOne, @)

		createOnEnter: (e)->
			return if e.keyCode != 13

			Schedules.create {
				begin:@inputBegin.val()||''
				end: @inputEnd.val()||''
				description: @inputDescription.val()||''
			}

			@inputBegin.val('')
			@inputEnd.val('')
			@inputDescription.val('')


	App =new AppView

