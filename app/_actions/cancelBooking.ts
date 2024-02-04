"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";

export const cancelBooking = async (bookingId: string) => {
  await db.booking.delete({
    where: {
      id: bookingId,
    },
  });

  // Quando houver uma ação ele realizar o refetch das informações. Ou seja, remove o cache
  revalidatePath("/");
  revalidatePath("/bookings");
};