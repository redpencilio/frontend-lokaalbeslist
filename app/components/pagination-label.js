import Component from '@glimmer/component';

export default class PaginationLabelComponent extends Component {
  get from() {
    let p = this.args.pagination;
    return Number(p.self.number) * Number(p.first.size);
  }

  get to() {
    let p = this.args.pagination;
    if (p.last.number == p.self.number) {
      return this.from + Number(p.last.size);
    }
    return this.from + Number(p.self.size);
  }
}
