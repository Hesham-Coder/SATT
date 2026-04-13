import { Card } from "@/components/ui/Card";
import prisma from "@/lib/db";
import { Users, FileText, MessageSquare, Briefcase } from "lucide-react";

export default async function DashboardOverview() {
  let conferencesCount = 0;
  let researchCount = 0;
  let messagesCount = 0;

  try {
    [conferencesCount, researchCount, messagesCount] = await Promise.all([
      prisma.conference.count(),
      prisma.researchArticle.count(),
      prisma.message.count(),
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Continue even if database query fails - show loading state
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">المؤتمرات</p>
            <p className="text-2xl font-bold">{conferencesCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">الأبحاث</p>
            <p className="text-2xl font-bold">{researchCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-amber-100 p-3 text-amber-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">رسائل جديدة</p>
            <p className="text-2xl font-bold">{messagesCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-purple-100 p-3 text-purple-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">المركز الإعلامي</p>
            <p className="text-2xl font-bold">--</p>
          </div>
        </Card>
      </div>
      
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">مرحبا بك في لوحة التحكم</h2>
        <p className="text-gray-600">اختر من القائمة الجانبية ما تريد إدارته</p>
      </div>
    </div>
  );
}
