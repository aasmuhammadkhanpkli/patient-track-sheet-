export interface PatientHeader {
  name: string;
  mrn: string;
  reportingDate: string;
  reportingTime: string;
}

export interface TrackRowData {
  desiredDate: string;
  desiredTime: string;
  desiredTat: string;
  actualDate: string;
  actualTime: string;
  actualTat: string;
  varianceTat: string;
  gapsIdentified: string;
  correctiveAction: string;
  responsibility: string;
  timeline: string;
  evidence: string;
}

export type TrackSheetData = Record<string, TrackRowData>;

export interface PatientRecord {
  id: string;
  header: PatientHeader;
  data: TrackSheetData;
  timestamp: number;
}