import { PaginationOptionsDto } from '@/shared/pagination';
import { Helper } from '@/utils/helpers/helper';
import {
  ClassTransformOptions,
  plainToClassFromExist,
  Type,
} from 'class-transformer';
export interface IPag<TData> extends PaginationOptionsDto {
  data: TData[];
  count: number;
  route: string;
}

export class PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export class PaginationLinks {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
}

export class Paginated<TData extends object> {
  items: TData[];
  @Type(() => PaginationMeta)
  meta: PaginationMeta;
  @Type(() => PaginationLinks)
  links: PaginationLinks;

  constructor(
    opt: IPag<TData>,
    extraQuery?: Record<string, string | number | undefined | Date>,
    options?: ClassTransformOptions,
  ) {
    plainToClassFromExist(this, this.paginate(opt, extraQuery), options);
  }

  private createMeta<TData extends object>(opt: IPag<TData>): PaginationMeta {
    return {
      itemCount: opt.count,
      totalItems: opt.data.length,
      itemsPerPage: opt.limit,
      currentPage: opt.page,
    };
  }

  private createLinks<TData extends object>(
    opt: IPag<TData>,
    extraQuery?: Record<string, string | number | undefined | Date>,
  ): PaginationLinks {
    const pageCount = Math.ceil(opt.count / opt.limit) | 0;
    const extra: string = extraQuery ? `&${Helper.objToQuery(extraQuery)}` : '';

    return {
      first: `${opt.route}?limit=${opt.limit}${extra}`,
      previous:
        opt.page > 1
          ? `${opt.route}?page=${opt.page - 1}&limit=${opt.limit}${extra}`
          : null,
      next:
        opt.page < pageCount
          ? `${opt.route}?page=${opt.page + 1}&limit=${opt.limit}${extra}`
          : null,
      last: `${opt.route}?page=${pageCount}&limit=${opt.limit}${extra}`,
    };
  }

  private paginate<TData extends object>(
    opt: IPag<TData>,
    extraQuery?: Record<string, string | number | undefined | Date>,
  ) {
    return {
      items: opt.data,
      links: this.createLinks(opt, extraQuery),
      meta: this.createMeta(opt),
    };
  }
}
