window.optimizely = window.optimizely || [];
window.__optCompositeTracker = (function() {

    var logger = (function(debug) {
      if(debug) return console;
      return {log: function() {}, group: function() {}, groupEnd: function() {}, groupCollapsed: function() {}, dir: function() {}};
    })(!!localStorage.getItem('__optCompositeTrackerDebug'));    

    logger.log('+++ Project JS')

    var extKey = '__optCompositeTracker';

    var setParams = function(paramsFromExtension) {
        var allExtData = JSON.parse(localStorage.getItem(extKey)) || {};
        // this is a little confusing. 
        // Maybe just do a one-time init to localStorage and skip for 
        // subsequent calls of the extension... 
        allExtData[paramsFromExtension.instance] = Object.assign(allExtData[paramsFromExtension.instance] || {}, paramsFromExtension);
        logger.log('+++ ALL EXT DATA', allExtData, paramsFromExtension);        
        logger.log('+++ SET PARAMS', extKey, allExtData);
        writeParams(allExtData);
    }

    var writeParams = function(params) {
        localStorage.setItem(extKey, JSON.stringify(params));
    }

    var getParams = function() {
        try {
            return JSON.parse(localStorage.getItem(extKey));
        } catch(err) { return {}; }
    }

    var fireEvent = function(api_name) {        
        window.optimizely.push({
          type: "event",
          eventName: api_name
        });
    }

    var heardEvent = function(api_name) {
        var allExtensionData = getParams(),
            madeChange = false;
        for(extensionInstance in allExtensionData) {
            var compositeMetricAPIName = allExtensionData[extensionInstance].composite_metric_api_name,
                evtList = allExtensionData[extensionInstance].event_list.split(/,\s*/),
                alreadyFiredCompositeMetric = !!allExtensionData[extensionInstance].composite_fired;
            if(alreadyFiredCompositeMetric) {
                logger.log('+++ Already fired composite metric');
                continue;
            }                
            if(!allExtensionData[extensionInstance].fired) allExtensionData[extensionInstance].fired = {};
            logger.log('+++ Heard: ' + api_name, 'Already fired:', allExtensionData[extensionInstance].fired, ' check against ', evtList);
            if(evtList.indexOf(api_name) > -1 && !(api_name in allExtensionData[extensionInstance].fired)) {
                logger.log('+++ New evt', api_name);       
                allExtensionData[extensionInstance].fired[api_name] = 1; // mark as seen
                madeChange = true;
            }
            if(evtList.sort().join() === Object.keys(allExtensionData[extensionInstance].fired).sort().join()) {
              logger.log('+++ Saw all events, fire:', compositeMetricAPIName);
              allExtensionData[extensionInstance].composite_fired = 1;
              fireEvent(compositeMetricAPIName);
              madeChange = true;
            }
            // check if all events in event_list have been converted on

        }
        if(madeChange) writeParams(allExtensionData);
    }             

    // INIT ROUTINE, listen for events
    window.optimizely.push({
      type: "addListener",
      filter: {
        type: "analytics",
        name: "trackEvent"
      },
      handler: function(event) {
        heardEvent(event.data.apiName || event.data.name);
      }
    });  
    logger.log('+++ Init __optCompositeTracker v0.1');

    var API = {            
        getParams, getParams,
        setParams: setParams,
        heardEvent: heardEvent
    }
    
    return API;
    
})();


