// PUT may send a partial update, so every field is optional.
export interface UpdateSettingsBody {
  phone?: string;
  landline?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}
