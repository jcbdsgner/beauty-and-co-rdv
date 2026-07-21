export type BookingStepId = "services" | "creneau" | "informations" | "confirmation";

export type PersonTab = {
  id: string;
  label: string;
  type: "adult" | "child";
};

export type CartItem = {
  /** Unique across the whole cart: `${personId}:${subServiceId}` */
  id: string;
  personId: string;
  personLabel: string;
  categoryId: string;
  categoryLabel: string;
  subServiceId: string;
  label: string;
  price: number;
  duration: string;
  durationMinutes: number;
};

export type Sex = "femme" | "homme" | "autre";

export type ContactInfo = {
  firstName: string;
  lastName: string;
  sex: Sex | "";
  email: string;
  phone: string;
  phoneCountry: string;
  whatsapp: string;
  whatsappCountry: string;
  whatsappSameAsPhone: boolean;
  address: string;
};

export const emptyContactInfo: ContactInfo = {
  firstName: "",
  lastName: "",
  sex: "",
  email: "",
  phone: "",
  phoneCountry: "SN",
  whatsapp: "",
  whatsappCountry: "SN",
  whatsappSameAsPhone: true,
  address: "",
};

export function isContactInfoComplete(info: ContactInfo): boolean {
  return (
    info.firstName.trim() !== "" &&
    info.lastName.trim() !== "" &&
    info.sex !== "" &&
    info.email.trim() !== "" &&
    info.phone.trim() !== ""
  );
}
