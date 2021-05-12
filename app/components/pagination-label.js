import Component from '@glimmer/component';

export default class PaginationLabelComponent extends Component {
  get from() {
    let p = this.args.pagination;
    let index = Number(p.self.number) * Number(p.first.size);

    return this.args.count ? index + 1 : index;
  }

  get to() {
    if (this.args.count === 0) {
      return 0;
    }

    let p = this.args.pagination;
    let from = this.from - 1;
    if (p.last.number == p.self.number) {
      return from + Number(p.last.size);
    }
    return from + Number(p.self.size);
  }
}
