import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | date-format', function (hooks) {
  setupRenderingTest(hooks);

  // TODO: Replace this with your real tests.
  test('it renders', async function (assert) {
    this.set('inputValue', '2021-03-25T18:30:00+01:00');

    await render(hbs`{{date-format inputValue}}`);

    assert.equal(this.element.textContent.trim(), '25 mrt. 2021 18:30');
  });
});
