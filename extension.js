var evtListArray = extension.event_list.split(/,\s*/),
    evtFiredMap = {};

evtListArray.forEach(function(evt) {
  evtFiredMap[evt] = 0;
});

window.__optCompositeTracker.setParams({
  composite_metric_api_name: extension.composite_metric_api_name,
  events: evtFiredMap,
  instance: 'exp-' + experimentId
});