import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | info/for-users', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:info/for-users');
    assert.ok(route);
  });
});
