import { BookingForm } from "@/components/booking/booking-form";

export default function RdvPage() {
  return (
    // Clips horizontally at the screen edge (without becoming a scroll container, so sticky still
    // works): person cards are swept off-screen when switching attendee (see globals.css).
    <section className="overflow-x-clip bg-[#EBDDDA] p-0 sm:p-[31px]">
      <BookingForm />
    </section>
  );
}
