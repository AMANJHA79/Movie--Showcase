import React from 'react'
import searchIcon from '../assets/search.svg'

const Search = ({search, setSearch}) => {

    
  return (
    <div className='search'>
        
        <div>
            <img src={searchIcon} alt="" />
            <input type="text" placeholder='Search for a movie' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <>
        
        </>

    </div>
  )
}

export default Search