"use client";

interface ConfirmPopupProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmPopup({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">{title}</h2>

        <p className="mt-2 text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          {onCancel && (
            <button onClick={onCancel} className="rounded-lg border px-4 py-2">
              Hủy
            </button>
          )}

          <button
            onClick={onConfirm}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
