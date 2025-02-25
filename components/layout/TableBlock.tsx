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

interface TableBlockProps {
  headers: string[];
  data: Record<string, any>[];
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
}

const TableBlock: React.FC<TableBlockProps> = ({
  headers,
  data,
  onEdit,
  onDelete,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(
    null,
  );

  const handleDelete = (row: Record<string, any>) => {
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
      <div className="w-full overflow-x-auto">
        <Table className="border border-primary">
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="border border-primary">
                  {header}
                </TableHead>
              ))}
              <TableHead className="border border-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell
                  style={{ width: "70px" }}
                  className="border border-primary text-center text-secondary"
                >
                  {rowIndex + 1}
                </TableCell>
                {headers.slice(1).map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="border border-primary text-secondary"
                  >
                    {row[header.toLowerCase()] ?? "-"}
                  </TableCell>
                ))}
                <TableCell className="border border-primary">
                  {onEdit && (
                    <button
                      className="text-primaryDark hover:underline"
                      onClick={() => onEdit(row)}
                    >
                      <EditIcon
                        className="text-primaryDark font-bold text-lg hover:scale-110 transition-all duration-200 ease-in-out hover:shadow-lg"
                        width={18}
                        height={18}
                      />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-red-500 hover:underline ml-4"
                      onClick={() => handleDelete(row)}
                    >
                      <RxCrossCircled className="text-white font-bold rounded-full text-lg bg-red-800 hover:bg-red-700 hover:scale-110 transition-all duration-200 ease-in-out hover:shadow-lg" />
                    </button>
                  )}
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
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        trigger={<Button className="hidden">Delete</Button>}
      >
        <p className="text-center text-gray-600">
          This action cannot be undone. Please confirm if you want to proceed
          with deletion.
        </p>
      </Modal>
    </div>
  );
};

export default TableBlock;
