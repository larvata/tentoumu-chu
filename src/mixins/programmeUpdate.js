var {updateProgramme,getSchedule} = require('../actions/programme');

export default{

  updateProgrammeInfo: function(type){
    /* fields: 
      date(month,day) 
      time(start,end)
      members
      title
      roomId
    */

    if (!['roomId','date','time','title','members'].includes(type)) {
      console.log(`updateProgrammeInfo: illegal field type: ${type}`);
      return;
    }


    if (type === 'roomId') {
      if (this.state.programme.key === "") {
        console.log("in new programmeList");
        return;
      }
    }

    var fields=[];
    if (type === 'date') {
      fields = ['month','day'];
    }
    else if (type === 'time'){
      fields = ['start', 'end'];
    }
    else{
      fields=[type];
    }



    // console.log("update fieldtype: " + type);
    

    if (this.isFieldsChanged(fields)) {

      // update programme data
      console.log("roommetalist: try execute updateProgramme");
      var p=this.getPartialProgramme(fields);
      context.executeAction(updateProgramme,p,()=>{
        this.setState({programmeOrigin: Object.assign({},this.state.programme)});
        console.log("execute action updateProgramme done,try refresh schedule");
        context.executeAction(getSchedule,{},()=>{
          console.log("executeAction: getSchedule done.");
        });
        
      });

    }

  },

  isFieldsChanged: function(fields){
    var {programme,programmeOrigin} = this.state;

    var changed = false;
    fields.forEach( v=>{
      if (programme[v] !== programmeOrigin[v]) {
        changed = true;
        return;
      }
      
    });

    return changed;
  },

  // partial programme for update, [key] always required
  getPartialProgramme: function(fields){
    var {programme} = this.state;
    var p={key: programme.key};
    fields.forEach( v=>{
      p[v] = programme[v];
    });

    return p;
  }
};