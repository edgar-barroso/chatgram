import { useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";

interface DeleteModalProps {
  onDelete: () => void;
  message: string;
}

export default function DeleteModal({ onDelete, message }: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  return (
    <>
      <button onClick={openModal} className="text-red-500/50 flex items-center cursor-pointer hover:scale-110 ">
        <FiTrash2 size={12} className="mr-1" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-background">Confirm Deletion</h2>
            <p className="mb-4 text-background">{message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="text-white bg-red-500 px-4 py-2 rounded flex items-center gap-1 cursor-pointer hover:bg-red-600"
              >
                <FiTrash2 size={12} /> Delete
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 px-4 py-2 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-100"
              >
                <FiX size={12} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
