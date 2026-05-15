import { Query } from "mongoose";
export declare class QueryBuilder<T> {
    queryModel: Query<T[], T>;
    query: Record<string, string>;
    private countQuery;
    constructor(queryModel: Query<T[], T>, query: Record<string, string>);
    filter(): this;
    search(searchableFild: string[]): this;
    sort(): this;
    select(): this;
    paginate(): this;
    build(): Query<T[], T, {}, unknown, "find", Record<string, never>>;
    getMeta(): Promise<{
        page: number;
        limit: number;
        total: any;
        totalPage: number;
    }>;
}
//# sourceMappingURL=QueryBuilder.d.ts.map