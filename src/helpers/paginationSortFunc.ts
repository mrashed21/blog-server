type IOpitons = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type IOpitonsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};
const paginationSortFun = (options: IOpitons): IOpitonsResult => {
  const page: number = options.page || 1;
  const limit: number = options.limit || 1;
  const skip: number = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortFun;
