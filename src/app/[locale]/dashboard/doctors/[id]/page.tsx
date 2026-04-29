import { getDoctorById } from "@/data/doctors";
import { DoctorForm } from "../_components/DoctorForm";
import { notFound } from "next/navigation";

export default async function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تعديل بيانات العضو</h1>
      <DoctorForm initialData={doctor} />
    </div>
  );
}
