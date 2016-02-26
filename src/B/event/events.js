Air.Module("B.event.events", function(){
  var events = {
    DATA_CHANGE        : beacon.createEvent("data change"),
    REPEAT_DATA_CHANGE : beacon.createEvent("repeat data change"),
    REPEAT_DONE        : beacon.createEvent("repeat done"),
    URL_CHANGE         : beacon.createEvent("url change"),
    PAGE404            : beacon.createEvent("")

  }
  return events;
});
