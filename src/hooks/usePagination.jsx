import { useState } from "react";

export default function usePagination(dataPerPage) {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const from = (page - 1) * dataPerPage;
    const to = from + dataPerPage - 1;
    
    return { page, setPage, totalPages, setTotalPages, from, to };
}