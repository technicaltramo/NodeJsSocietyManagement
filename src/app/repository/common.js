const e = module.exports

e.pagination = async (req,query,total)=>{
    //pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 1
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    query.skip(startIndex).limit(limit)
    const documents = await query

    const pagination = {}
    if (endIndex < total)
        pagination.next = {page: page + 1, limit}
    if (startIndex > 0)
        pagination.prev = {page: page - 1, limit}

    const count = documents.length;

    return {
        documents,
        pagination,
        count
    }
}