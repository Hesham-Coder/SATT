import { DoctorForm } from "../_components/DoctorForm";

export default function NewDoctorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إضافة عضو جديد</h1>
      <DoctorForm />
    </div>
  );
}
