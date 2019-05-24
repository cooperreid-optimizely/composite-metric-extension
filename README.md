# Composite Metric Extension
Track a metric that is a composite of several other event conversions

## Installing 
* Copy the [`projectjs.min.js`](https://github.com/cooperreid-optimizely/composite-metric-extension/blob/master/projectjs.min.js) content and add it to your Project Javascript
* Copy the [`extension.json`](https://github.com/cooperreid-optimizely/composite-metric-extension/blob/master/extension.json) content and [create a new Custom Analytics Extension](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Create_as_JSON)
* [Create a new Custom Event](https://help.optimizely.com/Build_Campaigns_and_Experiments/Custom_events_in_Optimizely_X#Create_a_new_custom_event) which will serve as the composite metric, _e.g._ `performed_all_actions`. When a visitor converts on the other events making up the composite event, a custom event using this `api_name` will be sent to Optimizely.

## Deploying

### Enable integration
* Visit Integrations tab on an experiment
* Check the "Tracked" checkbox to enable
* Input settings as described in the section below.

![test image size](/img/enable-integration.png)

### Settings
* `Composite Metric API Name` - Indicate the `api_name` of the Custom Event that you created in the third step during installation.
* `Event List` - A comma-separate list of `api_names` that all need to be converted on to result in a conversion of the composite metric.
