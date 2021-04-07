import Component from '@glimmer/component';

export default class PaginationLabelComponent extends Component {
  get from() {
    return this.self.number * this.pageSize;
  }

  get to() {
    return this.from + this.self.size;
  }

  get pageSize() {
    return this.self.size;
  }

  get self() {
    return this.args.pagination.self;
  }
}
