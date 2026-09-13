import { Firestore } from "@google-cloud/firestore";
import {
  FIRESTORE_DATABASE_ID,
  GCP_PROJECT_ID,
  INTAKES_COLLECTION,
} from "@/lib/gcp";

let db: Firestore | null = null;

export function gcpProjectId() {
  return process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || GCP_PROJECT_ID;
}

export function getFirestore() {
  if (db) return db;
  const projectId = gcpProjectId();
  if (projectId !== GCP_PROJECT_ID) {
    console.warn(
      `Lessfret expected GCP project ${GCP_PROJECT_ID}; using ${projectId}.`
    );
  }
  const databaseId = process.env.FIRESTORE_DATABASE || FIRESTORE_DATABASE_ID;
  db = new Firestore({
    projectId,
    ignoreUndefinedProperties: true,
    ...(databaseId && databaseId !== "(default)" ? { databaseId } : {}),
  });
  return db;
}

export function intakesCollection() {
  return getFirestore().collection(INTAKES_COLLECTION);
}
