import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | issue graph', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:issue-graph');
    assert.ok(route);
  });
});
