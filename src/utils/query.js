// Generate sort type
const generateSortType = (sortType) => {
  return sortType === 'desc' ? -1 : 1;
};

//Generate query string
const generateQueryString = (path, query)=>{
  const encodeQuery = Object.keys(query).map((key)=>encodeURIComponent(key)+'='+encodeURIComponent(query[key])).join('&') 
  return `${path}?${encodeQuery}`
}

const generateSelectedItems = (array, defaultArray)=>{
  let selectedArray = defaultArray
  if(array.length>0){
    selectedArray = array.split(',').map((item)=>item.trim())
  }
  return selectedArray
  
}

export { generateSortType, generateQueryString, generateSelectedItems };
