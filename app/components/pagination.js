import Component from '@glimmer/component';

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
  // Booleans
  // ---------------------------------
  get isFirstPage() {
    return this.self.number <= 0;
  }

  get isLastPage() {
    return this.self.number >= this.last.number;
  }

  get hasMultiplePages() {
    return this.last.number != 0;
  }

  // Numbers
  // ---------------------------------

  get pageSize() {
    return Number(this.self.size);
  }

  get currentPage() {
    return Number(this.self.number);
  }

  get previousPage() {
    if (this.currentPage == 0) {
      return 0;
    }
    if (this.currentPage == 1) {
      // This way we drop the query parameter instead of setting it to zero
      return undefined;
    }
    return this.currentPage - 1;
  }

  get nextPage() {
    if (this.currentPage == this.lastPage) {
      return this.currentPage;
    }
    return this.currentPage + 1;
  }

  get lastPage() {
    return Number(this.last.number);
  }

  // Objects
  // ---------------------------------
  get self() {
    return this.args.pagination.self;
  }

  get last() {
    return this.args.pagination.last;
  }
}
