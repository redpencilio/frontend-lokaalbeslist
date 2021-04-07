import Component from '@glimmer/component';
import { action } from '@ember/object';
// import { tracked } from '@glimmer/tracking';

// {
//   "meta": {
//     "count": 886,
//     "pagination": {
//       "first": {
//         "number": 0,
//         "size": 30
//       },
//       "last": {
//         "number": 29,
//         "size": 16
//       },
//       "self": {
//         "number": 0,
//         "size": 30
//       },
//       "next": {
//         "number": 1,
//         "size": 30
//       }
//     }
//   }
// }
export default class PaginationComponent extends Component {
  @action
  changePage(page) {
    // TODO: Use page everywhere?
    this.page = page['number'] || 0;
  }

  get isFirstPage() {
    return this.self.number == 0;
  }

  get isLastPAge() {
    return this.self.number == this.last.number;
  }

  get hasMultiplePages() {
    return this.last.number != 0;
  }

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

  get last() {
    return this.args.pagination.last;
  }
}
