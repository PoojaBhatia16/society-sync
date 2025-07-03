import React from 'react'

const Pagination = ({totalPosts,postPerPage,setCurrentPage}) => {

  let pages=[];
  
    for(let i =1;i<=Math.ceil(totalPosts/postPerPage);i++){
      pages.push(i);
    }
    return (
      <div className="flex gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className="px-3 py-1 border rounded-md hover:bg-blue-100"
          >
            {page}
          </button>
        ))}
      </div>
    );
    
}

export default Pagination;
