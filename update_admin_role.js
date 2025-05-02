import { db } from "./server/db.js";
import { users } from "./shared/schema.js";
import { eq } from "drizzle-orm";

async function updateUserToSuperAdmin() {
  try {
    // Actualizar el usuario con ID 1 a super_admin
    const result = await db
      .update(users)
      .set({ role: "super_admin" })
      .where(eq(users.id, 1))
      .returning();
    
    console.log("Usuario actualizado:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    process.exit(1);
  }
}

updateUserToSuperAdmin();