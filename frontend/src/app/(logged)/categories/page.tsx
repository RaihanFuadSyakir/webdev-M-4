"use client"
import CategorySelect from '@/components/category/CategorySelect'
import React, { useState } from 'react'

export default function Categories() {
    const [SelectedCategory,setSelectedCategory] = useState(0);
    console.log(SelectedCategory);
  return (
    <div className='bg-amber-100'>
        <CategorySelect setSelectedCategory={setSelectedCategory}/>
    </div>
  )
}
