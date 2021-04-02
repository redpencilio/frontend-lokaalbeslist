import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import camelCase from 'lodash.camelcase';

export default async function muSearch(
  basePath,
  page,
  size,
  sort,
  filter,
  dataMapping
) {
  let endpoint = `${basePath}/search?page[size]=${size}&page[number]=${page}`;

  for (let field in filter) {
    endpoint += `&filter[${field}]=${filter[field]}`;
  }

  if (sort) {
    let isDesc = (sort) => sort.charAt(0) === '-';
    endpoint += `&sort[${
      isDesc(sort) ? camelCase(sort.substr(1)) : camelCase(sort)
    }]=${isDesc(sort) ? 'desc' : 'asc'}`;
  }
  const { count, data } = await (await fetch(endpoint)).json();
  const pagination = getPaginationMetadata(page, size, count);
  const entries = A(data.map(dataMapping));

  return ArrayProxy.create({
    content: entries,
    meta: { count, pagination },
  });
}

const getPaginationMetadata = function (pageNumber, size, total) {
  const pagination = {};

  pagination.first = { number: 0, size };

  const lastPageNumber =
    total % size == 0 ? Math.floor(total / size) - 1 : Math.floor(total / size);
  const lastPageSize = total % size == 0 ? size : total % size;
  pagination.last = { number: lastPageNumber, size: lastPageSize };

  pagination.self = { number: pageNumber, size };

  if (pageNumber > 0) {
    pagination.prev = { number: pageNumber - 1, size };
  }

  if (pageNumber < lastPageNumber) {
    const nextPageSize = pageNumber + 1 == lastPageNumber ? lastPageSize : size;
    pagination.next = { number: pageNumber + 1, size: nextPageSize };
  }

  return pagination;
};
