import React, { useState } from 'react';
import { ArrowLeft, Save, Printer, FileSpreadsheet } from 'lucide-react';
import { SERVICE_DETAILS } from '../constants';
import { PatientHeader, TrackSheetData, TrackRowData } from '../types';

interface TrackSheetFormProps {
  onBack: () => void;
}

const initialRowData: TrackRowData = {
  desiredDate: '',
  desiredTime: '',
  desiredTat: '',
  actualDate: '',
  actualTime: '',
  actualTat: '',
  varianceTat: '',
  gapsIdentified: '',
  correctiveAction: '',
  responsibility: '',
  timeline: '',
  evidence: ''
};

export const TrackSheetForm: React.FC<TrackSheetFormProps> = ({ onBack }) => {
  const [header, setHeader] = useState<PatientHeader>({
    name: '',
    mrn: '',
    reportingDate: new Date().toISOString().split('T')[0],
    reportingTime: ''
  });

  const [rows, setRows] = useState<TrackSheetData>(() => {
    const initial: TrackSheetData = {};
    SERVICE_DETAILS.forEach(service => {
      initial[service] = { ...initialRowData };
    });
    return initial;
  });

  const handleHeaderChange = (field: keyof PatientHeader, value: string) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (service: string, field: keyof TrackRowData, value: string) => {
    setRows(prev => {
      const nextRows = { ...prev };
      const nextRow = { ...nextRows[service], [field]: value };

      // Auto-calculate Variance TAT
      // Formula: Desired TAT - Actual TAT
      if (field === 'desiredTat' || field === 'actualTat') {
        const desired = field === 'desiredTat' ? value : nextRow.desiredTat;
        const actual = field === 'actualTat' ? value : nextRow.actualTat;
        
        const desiredNum = parseFloat(desired);
        const actualNum = parseFloat(actual);

        // Check if both values are valid numbers (and not empty strings)
        if (!isNaN(desiredNum) && !isNaN(actualNum) && desired.trim() !== '' && actual.trim() !== '') {
          nextRow.varianceTat = (desiredNum - actualNum).toString();
        } else {
          // Optional: Reset variance if inputs are invalid/cleared. 
          // This keeps the sheet clean.
          nextRow.varianceTat = '';
        }
      }

      nextRows[service] = nextRow;
      return nextRows;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 print:bg-white print:h-auto">
      {/* Toolbar - Hidden when printing */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm print:hidden z-20 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2 text-blue-700">
            <FileSpreadsheet size={20} />
            <h1 className="text-lg font-bold">Patient Track Sheet</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors">
            <Save size={16} />
            Save Record
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 print:p-0 print:overflow-visible">
        <div className="max-w-[1600px] mx-auto bg-white shadow-xl print:shadow-none border border-gray-300 print:border-none">
          
          {/* Sheet Container */}
          <div className="p-8 print:p-4 min-w-[1200px]">
            
            {/* HEADER SECTION */}
            <div className="border-2 border-gray-800 mb-6">
              {/* Title Row */}
              <div className="bg-gray-200 text-center py-2 border-b-2 border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Individual Patient Track Sheet</h2>
              </div>
              
              {/* Info Grid */}
              <div className="flex flex-col md:flex-row">
                {/* Patient Name */}
                <div className="flex-1 flex border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="w-32 bg-blue-100 p-2 font-bold text-sm flex items-center justify-center border-r border-gray-800 text-gray-800">
                    Patient Name
                  </div>
                  <input 
                    type="text" 
                    value={header.name}
                    onChange={(e) => handleHeaderChange('name', e.target.value)}
                    className="flex-1 p-2 outline-none text-sm bg-white focus:bg-blue-50"
                    placeholder="Enter Name"
                  />
                </div>

                {/* MRN */}
                <div className="w-full md:w-64 flex border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="w-16 bg-blue-100 p-2 font-bold text-sm flex items-center justify-center border-r border-gray-800 text-gray-800">
                    MRN
                  </div>
                  <input 
                    type="text" 
                    value={header.mrn}
                    onChange={(e) => handleHeaderChange('mrn', e.target.value)}
                    className="flex-1 p-2 outline-none text-sm bg-white focus:bg-blue-50"
                    placeholder="000000"
                  />
                </div>

                {/* Reporting Info */}
                <div className="w-full md:w-80 flex flex-col">
                  <div className="bg-blue-100 p-1 font-bold text-xs text-center border-b border-gray-800 text-gray-800">
                    Reporting
                  </div>
                  <div className="flex flex-1">
                    <div className="flex-1 flex border-r border-gray-800">
                      <div className="w-12 bg-gray-50 p-1 text-[10px] flex items-center justify-center font-bold text-gray-600 border-r border-gray-400">
                        Date
                      </div>
                      <input 
                        type="date" 
                        value={header.reportingDate}
                        onChange={(e) => handleHeaderChange('reportingDate', e.target.value)}
                        className="flex-1 p-1 text-center outline-none text-sm bg-white focus:bg-blue-50"
                      />
                    </div>
                    <div className="flex-1 flex">
                      <div className="w-12 bg-gray-50 p-1 text-[10px] flex items-center justify-center font-bold text-gray-600 border-r border-gray-400">
                        Time
                      </div>
                      <input 
                        type="time" 
                        value={header.reportingTime}
                        onChange={(e) => handleHeaderChange('reportingTime', e.target.value)}
                        className="flex-1 p-1 text-center outline-none text-sm bg-white focus:bg-blue-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN TABLE */}
            <div className="border-2 border-gray-800">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  {/* Header Row 1 */}
                  <tr className="bg-blue-100 text-gray-900">
                    <th rowSpan={2} className="border border-gray-600 bg-blue-200 p-2 text-left w-64 font-bold border-r-2 border-r-gray-800">
                      Service Detail
                    </th>
                    
                    {/* Desired Header Group */}
                    <th colSpan={3} className="border border-gray-600 bg-green-100 p-1 text-center font-bold border-r-2 border-r-gray-800">
                      Desired Service Delivery
                    </th>
                    
                    {/* Actual Header Group */}
                    <th colSpan={3} className="border border-gray-600 bg-gray-200 p-1 text-center font-bold border-r-2 border-r-gray-800">
                      Actual Service Delivery
                    </th>

                    {/* Variance & Analysis Headers */}
                    <th rowSpan={2} className="border border-gray-600 bg-white p-1 text-center w-16 font-bold">
                      Variance<br/>TAT
                    </th>
                    <th rowSpan={2} className="border border-gray-600 bg-white p-2 text-center w-40 font-bold">
                      Gaps Identified
                    </th>
                    <th rowSpan={2} className="border border-gray-600 bg-white p-2 text-center w-40 font-bold">
                      Corrective Action
                    </th>
                    <th rowSpan={2} className="border border-gray-600 bg-white p-2 text-center w-24 font-bold">
                      Responsibility
                    </th>
                    <th rowSpan={2} className="border border-gray-600 bg-white p-2 text-center w-20 font-bold">
                      Timeline
                    </th>
                    <th rowSpan={2} className="border border-gray-600 bg-white p-2 text-center w-32 font-bold">
                      Evidence of Completion
                    </th>
                  </tr>

                  {/* Header Row 2 - Sub-headers */}
                  <tr>
                    {/* Desired Sub-headers */}
                    <th className="border border-gray-600 bg-green-50 p-1 w-24 font-semibold text-center text-[11px]">Date</th>
                    <th className="border border-gray-600 bg-green-50 p-1 w-20 font-semibold text-center text-[11px]">Time</th>
                    <th className="border border-gray-600 bg-green-50 p-1 w-16 font-semibold text-center text-[11px] border-r-2 border-r-gray-800">TAT (mins)</th>
                    
                    {/* Actual Sub-headers */}
                    <th className="border border-gray-600 bg-gray-100 p-1 w-24 font-semibold text-center text-[11px]">Date</th>
                    <th className="border border-gray-600 bg-gray-100 p-1 w-20 font-semibold text-center text-[11px]">Time</th>
                    <th className="border border-gray-600 bg-gray-100 p-1 w-16 font-semibold text-center text-[11px] border-r-2 border-r-gray-800">TAT</th>
                  </tr>
                </thead>
                
                <tbody>
                  {SERVICE_DETAILS.map((service, index) => (
                    <tr key={index} className="hover:bg-yellow-50 transition-colors group">
                      <td className="border border-gray-400 border-r-2 border-r-gray-800 px-3 py-1.5 font-medium text-gray-800 bg-gray-50 text-left">
                        {service}
                      </td>
                      
                      {/* Desired */}
                      <td className="border border-gray-400 p-0 bg-green-50/30">
                        <input type="date" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-mono text-xs text-gray-600"
                          value={rows[service].desiredDate}
                          onChange={(e) => handleRowChange(service, 'desiredDate', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0 bg-green-50/30">
                        <input type="time" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-mono text-xs text-gray-600"
                          value={rows[service].desiredTime}
                          onChange={(e) => handleRowChange(service, 'desiredTime', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 border-r-2 border-r-gray-800 p-0 bg-green-50/30">
                        <input type="number"
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-mono text-xs font-medium"
                          value={rows[service].desiredTat}
                          onChange={(e) => handleRowChange(service, 'desiredTat', e.target.value)}
                        />
                      </td>

                      {/* Actual */}
                      <td className="border border-gray-400 p-0 bg-blue-50/10">
                        <input type="date" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-mono text-xs text-gray-600"
                          value={rows[service].actualDate}
                          onChange={(e) => handleRowChange(service, 'actualDate', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0 bg-blue-50/10">
                        <input type="time" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-mono text-xs text-gray-600"
                          value={rows[service].actualTime}
                          onChange={(e) => handleRowChange(service, 'actualTime', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 border-r-2 border-r-gray-800 p-0 bg-blue-50/10">
                        <input type="number"
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-mono text-xs font-medium"
                          value={rows[service].actualTat}
                          onChange={(e) => handleRowChange(service, 'actualTat', e.target.value)}
                        />
                      </td>

                      {/* Analysis */}
                      <td className="border border-gray-400 p-0">
                         <input type="text" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 font-bold text-gray-700"
                          value={rows[service].varianceTat}
                          onChange={(e) => handleRowChange(service, 'varianceTat', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0">
                        <textarea 
                          rows={1}
                          className="w-full h-full p-1 outline-none bg-transparent focus:bg-blue-100 resize-none overflow-hidden text-xs align-middle leading-tight"
                          value={rows[service].gapsIdentified}
                          onChange={(e) => handleRowChange(service, 'gapsIdentified', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0">
                        <textarea 
                          rows={1}
                          className="w-full h-full p-1 outline-none bg-transparent focus:bg-blue-100 resize-none overflow-hidden text-xs align-middle leading-tight"
                          value={rows[service].correctiveAction}
                          onChange={(e) => handleRowChange(service, 'correctiveAction', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0">
                        <input type="text" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 text-xs"
                          value={rows[service].responsibility}
                          onChange={(e) => handleRowChange(service, 'responsibility', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0">
                        <input type="text" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 text-xs"
                          value={rows[service].timeline}
                          onChange={(e) => handleRowChange(service, 'timeline', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 p-0">
                        <input type="text" 
                          className="w-full h-full p-1 text-center outline-none bg-transparent focus:bg-blue-100 text-xs"
                          value={rows[service].evidence}
                          onChange={(e) => handleRowChange(service, 'evidence', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer Legend or Space */}
            <div className="mt-4 text-xs text-gray-500 print:hidden">
              * TAT = Turn Around Time (minutes).
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};