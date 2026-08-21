export type AccountInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  whatsapp: string;
  whatsappCountry: string;
  whatsappSameAsPhone: boolean;
  photoUrl: string | null;
};

export type Account = AccountInfo & { connected: boolean };

/** Seeded the first time a login on /connexion is simulated — there's no real auth backend, so every Compte is this same person until edited via "Mon compte". */
export const defaultAccountInfo: AccountInfo = {
  firstName: "Jean Claude",
  lastName: "Barry",
  email: "jcb@mobilemindsapp.com",
  phone: "76 356 98 74",
  phoneCountry: "SN",
  whatsapp: "76 356 98 74",
  whatsappCountry: "SN",
  whatsappSameAsPhone: true,
  photoUrl: null,
};

export type BookingHistoryEntry = {
  id: string;
  confirmedAt: string;
  date: string | null;
  time: string | null;
  locationLabel: string | null;
  items: { label: string; price: number }[];
  totalPrice: number;
};
