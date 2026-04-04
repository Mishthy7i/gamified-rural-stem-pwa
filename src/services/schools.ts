import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/** Distinct non-empty `school` values from `classes`, stable display string per case-insensitive key. */
export async function fetchDistinctSchoolsFromClasses(): Promise<string[]> {
  const snap = await getDocs(collection(db, "classes"));
  const byKey = new Map<string, string>();
  for (const docSnap of snap.docs) {
    const school = (docSnap.data() as { school?: string }).school?.trim();
    if (!school) continue;
    const k = school.toLowerCase();
    if (!byKey.has(k)) byKey.set(k, school);
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b));
}
