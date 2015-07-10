var React = require('react');
var RoomMetaStore = require('../../stores/RoomMetaStore')
var connectToStores = require('fluxible/addons/connectToStores');
// var ProgrammeListItem = require('./ProgrammeListItem.jsx')
var {updateProgramme} = require('../../actions/programme')
// var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

console.log("roommetalist.jsx loaded");

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

  getInitialState: function(e){
    return{
      programme:this.props.programme
    }
  },
  componentWillReceiveProps:function(nextProps){
    return{
      programme:nextProps.programme
    }
  },

  updateProgrammeRoom: function(e){
    var roomKey = React.findDOMNode(this.refs.room).value;
    var room = this.state.programme;
    room.roomId=roomKey;

    this.setState(room);

    if (roomKey!='') {
      console.log("roommetalist: try execute updateProgramme");
      console.log(this.state.programme);
      context.executeAction(updateProgramme,this.state.programme,function(){
        console.log("execute action updateProgramme done");
      })
    }
    console.log("room changed");
  },

  render: function(){
    var RoomMetaList=this.props.rooms.map(getRoomListItem);

    return (
      <select ref='room' value ={this.state.programme.roomId} onChange={this.updateProgrammeRoom}>
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
