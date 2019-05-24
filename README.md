# Composite Metric Extension
Track a metric that is a composite of several other event conversions

## Installing 
* Copy the [`pjs.min.js`](https://github.com/cooperreid-optimizely/composite-metric-extension/blob/master/pjs.js) content and add it to your Project Javascript
* Copy the [`extension.json`](https://github.com/cooperreid-optimizely/composite-metric-extension/blob/master/extension.json) content and [create a new Extension](https://help.optimizely.com/Build_Campaigns_and_Experiments/Extensions%3A_Create_reusable_templates_for_custom_features_in_Optimizely_X)
* [Create a new Custom Event](https://help.optimizely.com/Build_Campaigns_and_Experiments/Custom_events_in_Optimizely_X#Create_a_new_custom_event) which will serve as the composite metric, _e.g._ `performed_all_actions`. When a visitor converts on the other events making up the composite event, a custom event using this `api_name` will be sent to Optimizely.

## Deploying

### Add to experiment
For each variation:
  - Click "Create Change"
  - Add an instance of the Extension 
  - Fill in settings

![test image size](/img/setupexp.png)

### Settings
* _Composite Metric API Name_ - Indicate the `api_name` of the Custom Event that you created in the third step during installation.
* _Event List_ - A comma-separate list of `api_names` that all need to be converted on to result in a conversion of the composite metric.
