import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import "./OfflineBanner.css";

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="offline-banner" role="status">
      <WifiOff size={18} aria-hidden />
      <span>
        You are offline. The app keeps working from cache; changes sync when you
        reconnect.
      </span>
    </div>
  );
}
