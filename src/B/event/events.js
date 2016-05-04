Air.Module("B.event.events", function(){
  var events = {
    DATA_CHANGE        : beacon.createEvent("data change"),
    RUN_COMPLETE       : beacon.createEvent("run complete"),
    URL_CHANGE         : beacon.createEvent("url change"),
    PAGE404            : beacon.createEvent("")
  }
  return events;
});
