import prisma from "@/lib/db";

export async function getDoctors() {
  try {
    return await prisma.doctor.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(id: string) {
  try {
    return await prisma.doctor.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
}
