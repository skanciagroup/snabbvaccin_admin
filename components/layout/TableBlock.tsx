/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { EditIcon } from "lucide-react";
import { RxCrossCircled } from "react-icons/rx";
import Modal from "@/components/layout/Modal";
import { Button } from "@/components/ui/button";
import {
  BsFileEarmarkWord,
  BsFileEarmarkPdf,
  BsFileEarmarkImage,
} from "react-icons/bs";

interface TableBlockProps<T> {
  headers: string[];
  data: T[]; // Use generic type T
  onEdit: (row: T) => void; // Use generic type T
  onDelete: (row: T) => void; // Use generic type T
}

const TableBlock = <T extends Record<string, any>>({
  headers,
  data,
  onEdit,
  onDelete,
}: TableBlockProps<T>) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleDelete = (row: T) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow && onDelete) {
      onDelete(selectedRow);
    }
    setIsDeleteModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-lg shadow-md">
        <Table className="w-full border-collapse bg-white">
          <TableHeader>
            <TableRow className="bg-gray-50">
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="px-6 py-4 text-sm font-semibold text-gray-600 border-b border-gray-200"
                >
                  {header}
                </TableHead>
              ))}
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell
                  style={{ width: "70px" }}
                  className="px-6 py-4 text-sm text-gray-600 border-b border-gray-200 text-center"
                >
                  {rowIndex + 1}
                </TableCell>
                {headers.slice(1).map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="px-6 py-4 text-sm text-gray-600 border-b border-gray-200"
                  >
                    {header.toLowerCase() === "file_type" ? (
                      <div className="flex items-center gap-2">
                        {row[header.toLowerCase()]?.includes("doc") ? (
                          <>
                            <BsFileEarmarkWord
                              className="text-blue-600"
                              size={20}
                            />
                            <span>Word File</span>
                          </>
                        ) : row[header.toLowerCase()]?.includes("pdf") ? (
                          <>
                            <BsFileEarmarkPdf
                              className="text-red-600"
                              size={20}
                            />
                            <span>PDF File</span>
                          </>
                        ) : row[header.toLowerCase()]?.includes("image") ? (
                          <>
                            <BsFileEarmarkImage
                              className="text-green-600"
                              size={20}
                            />
                            <span>Image File</span>
                          </>
                        ) : (
                          row[header.toLowerCase()] ?? "-"
                        )}
                      </div>
                    ) : typeof row[header.toLowerCase()] === "boolean" ? (
                      row[header.toLowerCase()] ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      row[header.toLowerCase()] ?? "-"
                    )}
                  </TableCell>
                ))}
                <TableCell className="px-6 py-4 text-sm border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {onEdit && (
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => onEdit(row)}
                      >
                        <EditIcon
                          className="text-primary hover:text-primaryDark transition-colors duration-200"
                          width={18}
                          height={18}
                        />
                      </button>
                    )}
                    {onDelete && typeof onDelete === "function" && (
                      <button
                        className="p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                        onClick={() => handleDelete(row)}
                      >
                        <RxCrossCircled
                          className="text-red-600 hover:text-red-700 transition-colors duration-200"
                          size={18}
                        />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        //description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        trigger={<Button className="hidden">Delete</Button>}
      >
        <p className="text-center text-gray-600 text-sm">
          This action cannot be undone. Please confirm if you want to proceed
          with deletion.
        </p>
      </Modal>
    </div>
  );
};

export default TableBlock;
