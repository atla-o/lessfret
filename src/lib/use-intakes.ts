"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getServerIntakes,
  readIntakesSnapshot,
  refreshIntakes,
  subscribeIntakes,
} from "@/lib/intakes-store";

export function useIntakes() {
  const snapshot = useSyncExternalStore(
    subscribeIntakes,
    readIntakesSnapshot,
    getServerIntakes
  );

  useEffect(() => {
    void refreshIntakes();
  }, []);

  return snapshot;
}
