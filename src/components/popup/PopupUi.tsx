"use client";

interface PopupProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function PopupUi({ children, onClose }: PopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative rounded-xl bg-white p-6 shadow-xl dark:bg-black w-50 h-75 max-h-75 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-xl text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
