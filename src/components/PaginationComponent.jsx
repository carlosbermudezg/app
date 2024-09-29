import Pagination from '@mui/material/Pagination';
import { useState } from 'react';

const PaginationComponent = ({ page, totalPages, setPage })=>{
    const handleChange = (event, value) => {
        setPage(value);
    };
    return(
        <section className="pagination">
            <Pagination count={totalPages} size='small' page={page} onChange={handleChange} color='primary' />
        </section>
    )
}

export default PaginationComponent