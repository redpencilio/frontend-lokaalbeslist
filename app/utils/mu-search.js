import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import { SearchResult } from './search-result';

/**
 * Source: <https://github.com/lblod/frontend-toezicht-abb/blob/master/app/utils/mu-search.js>

 * @returns {ArrayProxy} Search results for specified search query
 */
export default async function muSearch(
  basePath: string,
  page: number,
  size: number,
  sort: string | undefined,
  filter: any,
  dataMapping: (item: any) => any
): Promise<ArrayProxy<SearchResult>> {
  let endpoint = `${basePath}/search?page[size]=${size}&page[number]=${page}`;

  for (let field in filter) {
    endpoint += `&filter[${field}]=${filter[field]}`;
  }

  if (sort) {
    let isDesc = sort.charAt(0) === '-';
    endpoint += isDesc ? `&sort[${sort.substr(1)}]=desc` : `&sort[${sort}]=asc`;
  }

  const { count, data } = await (await fetch(endpoint)).json();
  const pagination = getPaginationMetadata(page, size, count);
  const entries = A(data.map(dataMapping));

  // @ts-ignore
  return ArrayProxy.create({
    content: entries,
    meta: { count, pagination },
  });
}

interface PageInfo {
  number: number;
  size: number;
}

interface PaginationInfo {
  first: PageInfo;
  last: PageInfo;
  self: PageInfo;
  prev?: PageInfo;
  next?: PageInfo;
}

function getPaginationMetadata(
  pageNumber: number,
  size: number,
  total: number
): PaginationInfo {
  const lastPageNumber =
    total % size == 0 ? Math.floor(total / size) - 1 : Math.floor(total / size);
  const lastPageSize = total % size == 0 ? size : total % size;
  const last = { number: lastPageNumber, size: lastPageSize };

  const pagination: PaginationInfo = {
    first: { number: 0, size },
    self: { number: pageNumber, size },
    last,
  };

  if (pageNumber > 0) {
    pagination.prev = { number: pageNumber - 1, size };
  }

  if (pageNumber < lastPageNumber) {
    const nextPageSize = pageNumber + 1 == lastPageNumber ? lastPageSize : size;
    pagination.next = { number: pageNumber + 1, size: nextPageSize };
  }

  return pagination;
}
