var React = require('react');
var RoomMetaStore = require('../../stores/RoomMetaStore');
var connectToStores = require('fluxible/addons/connectToStores');

var programmeUpdateMixin = require('../../mixins/programmeUpdate');
var programmeChangeMixin = require('../../mixins/programmeChange');

function getRoomListItem(room){

  return(
    <option 
      value={room.key}
      key={room.key}>
      {room.room_alias}

    </option>
  );
}

var RoomMetaList=React.createClass({

  mixins: [programmeUpdateMixin,programmeChangeMixin],

  getInitialState: function(e){
    return{
      programme:this.props.programme
    }
  },


  componentWillReceiveProps: function(nextProps){

    console.log('componentWillReceiveProps');

    this.setState({programmeOrigin:Object.assign({},nextProps.programme)});

    return{
      programme:nextProps.programme
    }
  },





  componentWillMount: function(){
    // this.setState({lastRoomId:this.props.programme.roomId});
    // console.log("componentWillMount: --");
    this.setState({programmeOrigin:Object.assign({},this.state.programme)});
  },

  // updateProgrammeRoom: function(e){
  //   var {programme,programmeOrigin} = this.state;

  //   if (programmeOrigin.roomId !== programme.roomId) {

  //     // update programme data
  //     console.log("roommetalist: try execute updateProgramme");
  //     context.executeAction(updateProgramme,this.state.programme,()=>{
  //       this.setState({programmeOrigin: Object.assign({},programme)});
  //       console.log("execute action updateProgramme done");
  //     })

  //   }
  // },

  // changeProgrammeRoom: function(e){
  //   var roomKey = React.findDOMNode(this.refs.room).value;
  //   var programme = this.state.programme;
  //   programme.roomId=roomKey;
  //   this.setState({programme});

  //   console.log("room changed");
  // },

  getRoomClass: function(){
    if (this.state.programme.roomId !== this.state.programmeOrigin.roomId) {
      return {backgroundColor:"yellow"};
    }

    return {};
  },

  render: function(){
    var RoomMetaList=this.props.rooms.map(getRoomListItem);

    return (
      <select 
      ref='room' 
      value={this.state.programme.roomId} 
      onChange={this.changeProgrammeInfo.bind(null,'room','roomId')} 
      onBlur={this.updateProgrammeInfo.bind(null,'roomId')} 
      style={this.getRoomClass()}>

        <option value="" key="">None</option>
        {RoomMetaList}
      </select>
    );
  }
});

module.exports = connectToStores(
  RoomMetaList,
  [RoomMetaStore],
  {
    RoomMetaStore: function(store){
      return{
        rooms: store.getRoomMeta()
      }
    }
  }
)
