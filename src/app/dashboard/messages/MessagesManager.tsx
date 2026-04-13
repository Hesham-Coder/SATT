"use client";

import { deleteMessage, markAsRead } from "./actions";
import { Trash2, CheckCircle, Circle } from "lucide-react";

type MsgType = {
  id: string; name: string; email: string; message: string; isRead: boolean; createdAt: Date;
};

export function MessagesManager({ initialData }: { initialData: MsgType[] }) {
  async function handleDelete(id: string) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      await deleteMessage(id);
    }
  }

  async function toggleRead(id: string, currentStatus: boolean) {
    await markAsRead(id, !currentStatus);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">رسائل التواصل</h1>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">الاسم</th>
              <th className="px-6 py-3 font-semibold text-gray-700">البريد الإلكتروني</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الرسالة</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الحالة</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialData.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6 text-gray-500">لا توجد رسائل</td></tr>
            )}
            {initialData.map((msg) => (
              <tr key={msg.id} className={`hover:bg-gray-50 ${msg.isRead ? 'opacity-60' : 'font-semibold'}`}>
                <td className="px-6 py-4">{msg.name}</td>
                <td className="px-6 py-4">{msg.email}</td>
                <td className="px-6 py-4 max-w-[300px] truncate">{msg.message}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleRead(msg.id, msg.isRead)} className="flex items-center gap-1 text-xs">
                    {msg.isRead ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-gray-400" />}
                    {msg.isRead ? 'مقروءة' : 'غير مقروءة'}
                  </button>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button onClick={() => handleDelete(msg.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
