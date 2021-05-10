import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | info/for-municipalities', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:info/for-municipalities');
    assert.ok(route);
  });
});
