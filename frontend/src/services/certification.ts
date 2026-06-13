import api from "./api";
import type { Certificate, CertificationApplication, Inspection } from "@/types";

export async function getCertificates() {
  const { data } = await api.get("/certificates");
  return data as Certificate[];
}

export async function getCertificateById(id: string) {
  const { data } = await api.get(`/certificates/${id}`);
  return data as Certificate;
}

export async function verifyCertificate(qrToken: string) {
  const { data } = await api.get(`/certificates/verify/${qrToken}`);
  return data;
}

export async function createCertificationApplication(payload: FormData | Record<string, unknown>) {
  const { data } = await api.post("/certification/applications", payload, {
    headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return data as CertificationApplication;
}

export async function getMyApplications() {
  const { data } = await api.get("/certification/applications");
  return data as CertificationApplication[];
}

export async function scheduleInspection(applicationId: string, payload: Record<string, unknown>) {
  const { data } = await api.post(`/certification/applications/${applicationId}/inspections`, payload);
  return data as Inspection;
}

export async function issueCertificate(applicationId: string) {
  const { data } = await api.post(`/certification/applications/${applicationId}/issue`);
  return data as Certificate;
}
