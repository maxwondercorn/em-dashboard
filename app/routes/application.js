import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    google.charts.load('current', {'packages': ['geomap', 'corechart']});
  }
});
