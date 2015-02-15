do ->

	Schedule = Backbone.Model.extend()

	ScheduleList = Backbone.Collection.extend

		model: Schedule
		url: 'api/list/'

		nextItem: ()->
			if !@.length
				return 1
			return @.last().get('order')+1

		comparator: 'order'

	Schedules =new ScheduleList

	ScheduleView =Backbone.View.extend
		tagName: 'tr'

		# todo
		template: _.template($('#item-template').html())

		initialize: ()->

		render: ()->
			@$el.html(@template(@model.toJSON()))
			return @


	AppView = Backbone.View.extend
		el: $('#scheduleApp')



		initialize: ()->
			@inputBegin= @$('#new-schedule>td>input.begin')
			@inputEnd= @$('#new-schedule>td>input.end')
			@inputDescription= @$('#new-schedule>td>input.description')

			@listenTo(Schedules, 'add',@addOne)

			@main=$('#main')
			Schedules.fetch()


		render: ()->

		addOne: (schedule)->
			view =new ScheduleView({model:schedule})
			@$('#schedule-list').append(view.render().el)


	App =new AppView

