// components/ProductTable.jsx
'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

export default function Table({ data, columns }) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data,
    columns : memoizedColumns,
    pageCount: Math.ceil(data.length / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  return (
<div className="p-2 bg-white rounded-xl shadow-lg">
<div className="overflow-x-auto">
  <table className="min-w-full table-auto border border-gray-300 rounded overflow-hidden">
    <thead className="bg-gray-100">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-300"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>

    <tbody>
      {table.getRowModel().rows.map((row, idx) => (
        <tr
          key={row.id}
          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
  </div>

  {/* Pagination Controls */}
  <div className="mt-6 flex items-center justify-between">
    <button
      onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
      disabled={!table.getCanPreviousPage()}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Previous
    </button>

    <span className="text-sm text-gray-600">
      Page <strong>{pageIndex + 1}</strong> of {table.getPageCount()}
    </span>

    <button
      onClick={() =>
        setPageIndex((old) => (old < table.getPageCount() - 1 ? old + 1 : old))
      }
      disabled={!table.getCanNextPage()}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Next
    </button>
  </div>
</div>

  );
}
