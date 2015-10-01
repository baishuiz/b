Air.Module("core.event", function(){
  var events = {
    DATA_CHANGE : beacon.createEvent("data change"),
    REPEAT_DATA_CHANGE : beacon.createEvent("repeat data change")
  }
  return events;
});
