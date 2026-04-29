import Link from "next/link";
import Image from "next/image";
import { getDoctors } from "@/data/doctors";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteDoctor } from "./actions";

export default async function DoctorsDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const doctors = await getDoctors();
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الفريق الطبي</h1>
        <Link href={`/${locale}/dashboard/doctors/new`}>
          <Button variant="primary" size="md">
            <Plus size={18} className="ml-2" />
            إضافة عضو جديد
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">الاسم</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الدور</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الترتيب</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {doctor.image && (
                      <div className="relative size-10 overflow-hidden rounded-full border">
                         <Image 
                          src={doctor.image} 
                          alt={doctor.nameAr || doctor.name} 
                          fill
                          className="object-cover"
                         />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{doctor.nameAr || doctor.name}</div>
                      <div className="text-sm text-gray-500">{doctor.nameEn}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {doctor.roleAr || doctor.role}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {doctor.order}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/${locale}/dashboard/doctors/${doctor.id}`}>
                      <Button variant="secondary" size="md">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <form action={deleteDoctor.bind(null, doctor.id)}>
                      <Button type="submit" variant="secondary" size="md" className="text-red-600 hover:text-red-700 border-red-100 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  لا يوجد أعضاء مضافون حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
