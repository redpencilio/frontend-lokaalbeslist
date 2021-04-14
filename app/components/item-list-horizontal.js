import Component from '@glimmer/component';

/**
 * Higher order component to render (text) items in a horizontal list, seperated
 * by a seperator (e.g ",") and optionally embraced (e.g. by "(" and ")").
 *
 * Falsy values are filtered out.
 *
 * We do this because whitespace is a bitch, and not rendering the seperator for
 * the last element is as well.
 *
 * Sources: https://stackoverflow.com/questions/28989968/ember-yield-param-passing
 *
 * @param {array} items An array of items which will be yielded back one by one
 * @param {array} embrace A 2 element array of strings embracing the full list
 * @param {string} sep A seperator element between the items
 */
export default class ItemListHorizontalComponent extends Component {
  get items() {
    return this.args.items.filter((item) => !!item);
  }

  get last() {
    return this.items.length - 1;
  }
}
