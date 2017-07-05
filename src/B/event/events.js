Air.Module("B.event.events", function(){
  var events = {
    DATA_CHANGE        : beacon.createEvent("data change"),
    RUN_COMPLETE       : beacon.createEvent("run complete"),
    URL_CHANGE         : beacon.createEvent("url change"),
    USER_ACTION        : beacon.createEvent("user action"),
    PAGE_SHOW          : beacon.createEvent("page show"),
    PAGE_HIDE          : beacon.createEvent("page hide"),
    PAGE404            : beacon.createEvent("")
  }
  return events;
});
