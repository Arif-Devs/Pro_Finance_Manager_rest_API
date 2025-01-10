// Generate pagination
const generatePagination = (totalPage, page, totalItems, limit)=>{
    // Initialize pagination object
    let pagination={totalItems, currentPage: page,limit,totalPage}
    
    
    //Generate next page number
    if(page<totalPage){
        pagination.nextPage = page+1
    }
    
    //Generate prevPage number
    if(page > 1){
        pagination.prevPage = page-1
    }
    return pagination
};

export default generatePagination

