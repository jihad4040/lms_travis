"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    queryModel;
    query;
    countQuery; // filtered query for meta
    constructor(queryModel, query) {
        this.queryModel = queryModel;
        this.query = query;
        this.countQuery = queryModel; // initialize count query
    }
    filter() {
        const filter = { ...this.query };
        const excludeFild = ["searchTerm", "sort", "fields", "page", "limit"];
        for (const value of excludeFild)
            delete filter[value];
        this.queryModel = this.queryModel.find(filter);
        this.countQuery = this.queryModel; // filtered query
        return this;
    }
    search(searchableFild) {
        const searchTerm = this.query.searchTerm || "";
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFild.map(fild => ({
                    [fild]: { $regex: searchTerm, $options: "i" }
                }))
            };
            this.queryModel = this.queryModel.find(searchQuery);
            this.countQuery = this.queryModel; // filtered + search query
        }
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.queryModel = this.queryModel.sort(sort);
        return this;
    }
    select() {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.queryModel = this.queryModel.select(fields);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.queryModel = this.queryModel.limit(limit).skip(skip);
        return this;
    }
    build() {
        return this.queryModel;
    }
    async getMeta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 12;
        // Use filtered query for counting
        const totalDocumtnt = await this.countQuery.model.countDocuments(this.countQuery.getFilter());
        const totalPage = Math.ceil(totalDocumtnt / limit);
        return { page, limit, total: totalDocumtnt, totalPage };
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map