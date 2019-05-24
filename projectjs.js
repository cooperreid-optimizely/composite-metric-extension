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
        /**
        * Any data passed to this function should 
        * overwrite existing data in localStorage
        */
        allExtData[paramsFromExtension.instance] = Object.assign(paramsFromExtension || {}, allExtData[paramsFromExtension.instance] || {});
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
                alreadyFiredCompositeMetric = !!allExtensionData[extensionInstance].composite_fired,
                allFired = false;
            if(alreadyFiredCompositeMetric) {
                logger.log('+++ Already fired composite metric');
                continue;
            }                            
            logger.log('+++ Heard: ' + api_name, 'Events: ', allExtensionData[extensionInstance].events);
            if(api_name in allExtensionData[extensionInstance].events) {
                allExtensionData[extensionInstance].events[api_name] = 1;
                logger.log('+++ Mark event tracked', allExtensionData[extensionInstance].events);                
                madeChange = true;
            }
            allFired = Object.values(allExtensionData[extensionInstance].events).every(function(v) { return v === 1 });            
            if(allFired) {
              logger.log('+++ Saw all events, fire:', compositeMetricAPIName);
              allExtensionData[extensionInstance].composite_fired = 1;
              fireEvent(compositeMetricAPIName);
              madeChange = true;
            }
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
    logger.log('+++ Init __optCompositeTracker v0.3');

    var API = {            
        getParams, getParams,
        setParams: setParams,
        heardEvent: heardEvent
    }
    
    return API;
    
})();
