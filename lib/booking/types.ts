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
  twoPractitionersEligible: boolean;
};

export type Sex = "femme" | "homme";

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
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_REGEX = /^\d{6,15}$/;

export type ContactInfoField = "firstName" | "lastName" | "sex" | "email" | "phone";
export type ContactInfoErrors = Partial<Record<ContactInfoField, string>>;

export function getContactInfoErrors(info: ContactInfo): ContactInfoErrors {
  const errors: ContactInfoErrors = {};

  if (!info.firstName.trim()) errors.firstName = "Le prénom est requis";
  if (!info.lastName.trim()) errors.lastName = "Le nom est requis";
  if (!info.sex) errors.sex = "Merci de sélectionner un genre";

  if (!info.email.trim()) {
    errors.email = "L'adresse email est requise";
  } else if (!EMAIL_REGEX.test(info.email.trim())) {
    errors.email = "Adresse email invalide";
  }

  if (!info.phone.trim()) {
    errors.phone = "Le numéro de téléphone est requis";
  } else if (!PHONE_DIGITS_REGEX.test(info.phone.replace(/\D/g, ""))) {
    errors.phone = "Numéro de téléphone invalide";
  }

  return errors;
}

export function isContactInfoComplete(info: ContactInfo): boolean {
  return Object.keys(getContactInfoErrors(info)).length === 0;
}
