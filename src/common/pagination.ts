import { Collection, Document } from 'mongodb';
import { Page, PaginatedResponse } from '../interfaces/interfaces';
import { GraphQLError } from 'graphql';

export async function Paginate(
  collection: Collection<any>,
  aggregate: Document[],
  pagination: Page
) {
  try {
    const skips = pagination.pageSize * (pagination.pageNumber - 1);
    const countResults = await countDocuments(collection, aggregate);
    if (typeof countResults !== 'number') {
      return countResults;
    }
    console.log('totalElements', countResults);

    const pipeline = [...aggregate, { $skip: skips }, { $limit: pagination.pageSize }];
    console.log('Query:', JSON.stringify(pipeline, null, 1));
    const paginated = await collection.aggregate(pipeline).toArray();

    const totalPages: number = Math.ceil(countResults / pagination.pageSize);
    const firstPage: boolean = pagination.pageNumber === 1;
    const lastPage: boolean = pagination.pageNumber === totalPages;
    const previousPage = firstPage ? null : pagination.pageNumber - 1;
    const nextPage = lastPage ? null : pagination.pageNumber + 1;

    const response: PaginatedResponse = {
      data: [...paginated],
      pagination: {
        totalDocs: countResults,
        limit: pagination.pageSize,
        hasNextPage: !lastPage,
        hasPrevPage: !firstPage,
        page: pagination.pageNumber,
        totalPages: totalPages,
        offset: skips,
        prevPage: previousPage,
        nextPage: nextPage,
      },
    };

    return response;
  } catch (error) {
    console.log('Paginate', 'Mongo error occurred while fetching results.');
    throw new GraphQLError(JSON.stringify(error));
  }
}

async function countDocuments(collection: Collection, aggregate: Document[]) {
  try {
    const count = await collection
      .aggregate([
        ...aggregate,
        {
          $group: {
            _id: null,
            totalElements: { $sum: 1 },
          },
        },
      ])
      .toArray();
    if (!count.length) {
      return 0;
    }
    return count[0].totalElements as number;
  } catch (error) {
    console.log('countDocuments', 'Mongo error occurred while counting all documents.');
    throw new GraphQLError(JSON.stringify(error));
  }
}
