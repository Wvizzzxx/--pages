export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1 | string>;
  populate?: Array<{ path: string; select?: string }>;
  criteria?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginateQuery<T>(
  Model: any,
  criteria: Record<string, any> = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 } as Record<string, 1 | -1 | string>;

  let query = Model.find(criteria);

  if (options.populate && options.populate.length > 0) {
    for (const pop of options.populate) {
      query = query.populate(pop);
    }
  }

  const [data, total] = await Promise.all([
    query.skip(skip).limit(limit).sort(sort).lean(),
    Model.countDocuments(criteria),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data as T[],
    total,
    page,
    limit,
    totalPages,
  };
}