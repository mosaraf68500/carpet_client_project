import Settings, { SETTINGS_SINGLETON_ID, type ISettings } from "./settings.model.js";
import type { UpdateSettingsBody } from "./settings.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export async function getSettings(): Promise<ISettings> {
  let settings = await Settings.findById(SETTINGS_SINGLETON_ID);
  if (!settings) {
    // first read ever — create an empty singleton so the dashboard has something to edit
    settings = await Settings.create({ _id: SETTINGS_SINGLETON_ID });
  }
  return settings;
}

export async function updateSettings(data: UpdateSettingsBody): Promise<ISettings | null> {
  const { phone, landline, whatsapp, email, address } = data;

  return Settings.findByIdAndUpdate(
    SETTINGS_SINGLETON_ID,
    { phone, landline, whatsapp, email, address },
    { new: true, upsert: true, runValidators: true }
  );
}
