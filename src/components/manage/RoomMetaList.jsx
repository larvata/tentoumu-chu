var React = require('react');
var RoomMetaStore = require('../../stores/RoomMetaStore')
var connectToStores = require('fluxible/addons/connectToStores');
var {updateProgramme} = require('../../actions/programme')


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

  componentWillReceiveProps: function(nextProps){
    return{
      programme:nextProps.programme
    }
  },

  componentWillMount: function(){
    this.setState({lastRoomId:this.props.programme.roomId});
  },

  updateProgrammeRoom: function(e){
    var programme = this.state.programme;

    if (this.state.lastRoomId !== programme.roomId) {
      if (programme.roomId != '') {
        // update programme data
        console.log("roommetalist: try execute updateProgramme");
        console.log(this.state.programme);
        context.executeAction(updateProgramme,this.state.programme,()=>{
          this.setState({lastRoomId:programme.roomId});
          console.log("execute action updateProgramme done");
        })
      }
    }
  },

  changeProgrammeRoom: function(e){
    var roomKey = React.findDOMNode(this.refs.room).value;
    var programme = this.state.programme;
    programme.roomId=roomKey;
    this.setState(programme);

    console.log("room changed");
  },

  getRoomClass: function(){
    if (this.state.programme.roomId !== this.state.lastRoomId) {
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
      onChange={this.changeProgrammeRoom} 
      onBlur={this.updateProgrammeRoom} 
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
