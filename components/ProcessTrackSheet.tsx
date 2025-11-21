import React from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { SERVICE_DETAILS } from '../constants';
import { PatientRecord } from '../types';

interface ProcessTrackSheetProps {
  records: PatientRecord[];
  onBack: () => void;
}

export const ProcessTrackSheet: React.FC<ProcessTrackSheetProps> = ({ records, onBack }) => {
  
  // Helper to get content for a specific cell
  // Currently showing Actual Date and Variance as a summary
  const getCellContent = (record: PatientRecord, service: string) => {
    const rowData = record.data[service];
    if (!rowData) return null;

    const hasActual = rowData.actualDate || rowData.actualTime;
    const hasVariance = rowData.varianceTat;

    if (!hasActual && !hasVariance) return null;

    return (
      <div className="flex flex-col justify-center h-full text-[10px] leading-tight">
        {rowData.actualDate && <span>{rowData.actualDate}</span>}
        {rowData.varianceTat && (
          <span className={`font-bold ${parseInt(rowData.varianceTat) > 0 ? 'text-red-600' : 'text-green-600'}`}>
            Var: {rowData.varianceTat}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-20 sticky top-0 print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <h1 className="text-lg font-bold text-gray-800">Process Track Sheet</h1>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="bg-white shadow-lg border border-gray-300 inline-block min-w-full align-middle">
          
          {/* Sheet Header Title */}
          <div className="bg-blue-100 text-center py-2 border-b-2 border-gray-800 sticky left-0">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Process Track Sheet</h2>
          </div>

          <table className="min-w-full border-collapse text-xs table-fixed">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {/* Sticky Patient Name Column */}
                <th className="sticky left-0 z-20 bg-[#d6bcbc] text-gray-900 border border-gray-600 p-2 w-32 min-w-[120px] text-left font-bold border-r-2 border-r-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Pt. Name
                </th>
                {/* Sticky MRN Column */}
                <th className="sticky left-32 z-20 bg-[#d6bcbc] text-gray-900 border border-gray-600 p-2 w-24 min-w-[90px] text-left font-bold border-r-2 border-r-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  MRN
                </th>
                
                {/* Service Columns */}
                {SERVICE_DETAILS.map((service, idx) => (
                  <th key={idx} className="bg-[#d6bcbc] text-gray-900 border border-gray-600 p-2 w-32 min-w-[120px] font-bold text-center whitespace-normal h-16 align-middle">
                    {service}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={SERVICE_DETAILS.length + 2} className="p-8 text-center text-gray-500 italic">
                    No records found. Add a new patient track to populate this sheet.
                  </td>
                </tr>
              ) : (
                records.map((record, rIdx) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors">
                    {/* Sticky Name Cell */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50 border border-gray-400 border-r-2 border-r-gray-800 p-2 font-medium text-gray-900 truncate shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {record.header.name || '-'}
                    </td>
                    {/* Sticky MRN Cell */}
                    <td className="sticky left-32 z-10 bg-white group-hover:bg-blue-50 border border-gray-400 border-r-2 border-r-gray-800 p-2 font-mono text-gray-600 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {record.header.mrn || '-'}
                    </td>

                    {/* Data Cells */}
                    {SERVICE_DETAILS.map((service, cIdx) => (
                      <td key={`${record.id}-${cIdx}`} className="border border-gray-400 p-1 text-center h-12 align-middle whitespace-nowrap">
                        {getCellContent(record, service)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};