import Image from "next/image";
import { cn } from "@/lib/utils";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { TwoPractitionersToggle } from "@/components/booking/two-practitioners-toggle";
import { StepFooter } from "@/components/booking/steps/step-footer";
import { bookingLocations } from "@/lib/data/booking-locations";
import { addMinutes, formatDurationMinutes } from "@/lib/booking/format";

const timeSlots = ["10:00", "11:30", "12:00", "13:30", "14:30", "16:00"];

type CreneauStepProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  totalMinutes: number;
  twoPractitionersMinutes: number;
  twoPractitioners: boolean;
  onToggleTwoPractitioners: (enabled: boolean) => void;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
};

export function CreneauStep({
  selectedDate,
  onSelectDate,
  selectedLocationId,
  onSelectLocation,
  selectedTime,
  onSelectTime,
  totalMinutes,
  twoPractitionersMinutes,
  twoPractitioners,
  onToggleTwoPractitioners,
  canContinue,
  onContinue,
  onBack,
}: CreneauStepProps) {
  const effectiveMinutes = twoPractitioners ? twoPractitionersMinutes : totalMinutes;
  return (
    <div>
      <h2 className="text-[21px] font-bold text-[var(--color-gray-800)]">Choisir un créneau</h2>
      <p className="mt-1 text-[19px] text-[var(--color-gray-500)]">
        Choisissez un jour, une heure, et un lieu qui vous conviennent.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="sm:max-w-[384px] sm:flex-1">
          <BookingCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </div>

        {selectedDate && (
          <div className="flex flex-col gap-4 sm:flex-1">
            <div className="rounded-2xl border border-[var(--color-gray-200)] bg-white p-[25px]">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[rgba(237,220,218,0.4)]">
                  <Image src="/images/rdv/icon-location.svg" alt="" width={20} height={20} />
                </span>
                <h3 className="text-[19px] font-bold text-[var(--color-gray-800)]">Choisissez un lieu</h3>
              </div>
              <div className="mt-4 flex gap-2">
                {bookingLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => onSelectLocation(location.id)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-[17px] font-bold transition",
                      selectedLocationId === location.id
                        ? "bg-[var(--core-brand-color)] text-[var(--brand-taupe-muted)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]"
                        : "border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]",
                    )}
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedLocationId && (
              <div className="rounded-2xl border border-[var(--color-gray-200)] bg-white p-[25px]">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[rgba(237,220,218,0.4)]">
                    <Image src="/images/rdv/icon-clock-heading.svg" alt="" width={20} height={20} />
                  </span>
                  <h3 className="text-[19px] font-bold text-[var(--color-gray-800)]">Choisissez un créneau</h3>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectTime(slot)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-[17px] font-bold transition",
                        selectedTime === slot
                          ? "bg-[var(--core-brand-color)] text-[var(--brand-taupe-muted)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]"
                          : "border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]",
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {selectedTime && totalMinutes > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-[rgba(237,220,218,0.4)] px-4 py-3">
                    <Image src="/images/rdv/icon-info-banner.svg" alt="" width={16} height={16} />
                    <p className="text-[17px] text-[var(--brand-taupe-muted)]">
                      Votre rendez-vous se terminera vers{" "}
                      <span className="font-bold">{addMinutes(selectedTime, effectiveMinutes)}</span>{" "}
                      ({formatDurationMinutes(effectiveMinutes)} au total)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTime && (
        <TwoPractitionersToggle
          enabled={twoPractitioners}
          onChange={onToggleTwoPractitioners}
          soloMinutes={totalMinutes}
          twoPractitionersMinutes={twoPractitionersMinutes}
        />
      )}

      <div className="mt-8">
        <StepFooter onBack={onBack} onContinue={onContinue} continueDisabled={!canContinue} />
      </div>
    </div>
  );
}
