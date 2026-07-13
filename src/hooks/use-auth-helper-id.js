// src/features/authentication-v2/use-auth-user-id.js
// import { useAuthV2 } from "./use-auth-v2";

import { useAuthV2 } from "@/features/authentication-v2/use-auth-v2";

// user object-এ যেটা আছে সেটা ধরে — employee_id বা id, যেটা তোমার
// CREATION_BY / UPDATE_BY কলামে store করার কথা
export function useAuthUserId() {
  const { user } = useAuthV2();
  return  user?.id ?? null;
}