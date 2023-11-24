import BudgetLeft from '@/components/Budget/BudgetLeft'
import ListReport from '@/components/Report/ListReport'
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb'
import React from 'react'

export default function page() {
    return (
        <>
            <Breadcrumb pageName="Report" />
            <div className='flex'>
                <ListReport />
                <BudgetLeft />
            </div>
        </>

    )
}
