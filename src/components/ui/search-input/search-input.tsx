import React from 'react'
import { Search } from '../../shared/icons/search'
import s from './search-input.module.scss'
export const SearchInput = () => {
  return (
    <div className={s.search_wrapper}>
      <Search />
      <input id="search_input" name="search" placeholder='Поиск...' />
    </div>
  )
}
