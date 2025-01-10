import { generateQueryString } from "./query.js";

// create hateoas links generator
const createHateoasLinkGenerator = (baseUrl, id, slug)=>{
    return{
        self: `${process.env.API_BASE_URL}${baseUrl}/${id}/${slug}`,
        allItems: `${process.env.API_BASE_URL}${baseUrl}`
    }
}

// Generate hateoas for all data

const generateAllDataHateoasLinks = (data,url,baseUrl,page,totalPage,queryParams)=>{
    const links = {}
    // add self link
    if(data.length>0){
    links.self = `${process.env.API_BASE_URL}${url}`
    }
    // Add nextPage link if applicable
    if(page<totalPage){
        const nextPageQueryString = generateQueryString(`${process.env.API_BASE_URL}${baseUrl}`, {...queryParams, page:page+1})
        links.nextPage = nextPageQueryString
    }
    if(page>1){
        const prevPageQueryString = generateQueryString(`${process.env.API_BASE_URL}${baseUrl}`, {...queryParams, page:page-1})
        links.prevPage = prevPageQueryString
    }
    return links
}

export{
    createHateoasLinkGenerator,
    generateAllDataHateoasLinks
}