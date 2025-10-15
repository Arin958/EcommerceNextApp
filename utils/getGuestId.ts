export const getGuestId = () => {
  if (typeof window === "undefined") return null;

  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID(); // Generate unique ID
    localStorage.setItem("guest_id", guestId);
  }
  return guestId;
};