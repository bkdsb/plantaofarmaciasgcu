import { PreferencesForm } from "@/components/public/preferences-form";
import { PushOptinCard } from "@/components/public/push-optin-card";

export default function PreferencesPage() {
  return (
    <div className="space-y-4">
      <PushOptinCard />
      <PreferencesForm
        defaultValues={{
          receiveGeneralWeekly: true,
          receiveFavorites: true,
          receiveFavoriteReminder: true,
          reminderDaysBefore: 1,
          isOptedInPush: false
        }}
      />
    </div>
  );
}
