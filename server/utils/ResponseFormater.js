/*
example response
{
    error:{
    "type": "E_ERROR",
    "description": "falla de logeo por mal envio del token"
    },
    data://respuestaDeMongo,
    meta:{
        info extra,
        count://cantidad de elementos que tiene la data
        page:{
            "current-page":pageNumber,
            "per-page":numberitemsInPage,
            "from":pageNumber,
            "to":pageNumber,
            "total":result2db,
            "last-page":itemsInt,
        },
    },
}
*/
module.exports = function  responseFormater({data,meta={},error,code=200,totalItems=0,currentPage,perPage,startInZero=true}) {
    const response = {}
    if(data && !error){
        response.data=data
    } else if(error){
        response.error=error
    }
    response.meta=meta
    response.meta.statusCode= code
    if(!startInZero) currentPage--
    if((currentPage >=0) && (perPage >=0)){
        var itemsInt = parseInt(totalItems/perPage) -1
        if(((totalItems/perPage) - itemsInt) > 0) {
            itemsInt++
        }
        var to=(((perPage*currentPage))+perPage)>totalItems?totalItems:(((perPage*currentPage))+perPage)
        response.meta.page={
            "current-page": startInZero ? currentPage : currentPage+1,
            "per-page":perPage,
            "from":(perPage*currentPage)+1,
            "to":to ,
            "total":totalItems,
            "last-page": startInZero ? itemsInt : itemsInt+1,
        }
    }

    return response;
}