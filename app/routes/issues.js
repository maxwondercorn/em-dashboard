import $ from 'jquery';
import { later, cancel } from '@ember/runloop';
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    // Fetch new data every 3 seconds with Ember.run.later 
    let pollIssues = later(this, function() {
      this.model().then()
          .then(function(data) {
            this.controller.set('model', data);
            console.log('Polling issues data');
          }.bind(this));
    }, 3000);

    // Cancel polling issues data when route changes, but
    // make delay it 100ms make sure to route changed before cancelling it
    setTimeout(() => {
      if (window.location.hash !== '#/issues') {
        console.log('Cancelled polling issues data');
        cancel(pollIssues);
      }
    }, 100);

    return $.get('./data/issues.json');
  }
});
