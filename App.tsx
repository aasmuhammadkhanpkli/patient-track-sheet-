import React, { useState, useEffect } from 'react';
import { PlusCircle, Activity, FileSpreadsheet } from 'lucide-react';
import { TrackSheetForm } from './components/TrackSheetForm';
import { ProcessTrackSheet } from './components/ProcessTrackSheet';
import { PatientRecord } from './types';

// Simple view state management
type View = 'HOME' | 'TRACK_SHEET' | 'PROCESS_SHEET';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [records, setRecords] = useState<PatientRecord[]>([]);

  // Load records from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('patient_track_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse records', e);
      }
    }
  }, []);

  const handleSaveRecord = (record: PatientRecord) => {
    const updatedRecords = [...records, record];
    setRecords(updatedRecords);
    localStorage.setItem('patient_track_records', JSON.stringify(updatedRecords));
    alert('Record Saved Successfully!');
    setCurrentView('HOME');
  };

  if (currentView === 'TRACK_SHEET') {
    return <TrackSheetForm onBack={() => setCurrentView('HOME')} onSave={handleSaveRecord} />;
  }

  if (currentView === 'PROCESS_SHEET') {
    return <ProcessTrackSheet records={records} onBack={() => setCurrentView('HOME')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MediTrack System</h1>
          </div>
          <div className="text-sm text-blue-100">
            Admin Portal
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Patient Service Tracking
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Manage and monitor individual patient service delivery timelines, identify gaps, and track corrective actions efficiently.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          
          {/* Add Patient Track Button Card */}
          <button 
            onClick={() => setCurrentView('TRACK_SHEET')}
            className="group relative flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-blue-300 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 ease-in-out text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            <div className="relative z-10 p-4 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <PlusCircle size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-2">Add Patient Track</h3>
            <p className="relative z-10 text-slate-500 text-sm">
              Create a new service delivery tracking sheet for a patient.
            </p>
          </button>

          {/* View Records Button Card */}
          <button 
            onClick={() => setCurrentView('PROCESS_SHEET')}
            className="group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer text-center"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            <div className="relative z-10 p-4 bg-slate-100 text-slate-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100 group-hover:text-blue-600">
              <FileSpreadsheet size={40} strokeWidth={1.5} />
            </div>
            <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-2">View Records</h3>
            <p className="relative z-10 text-slate-500 text-sm">
              Access and manage existing patient tracking sheets.
            </p>
          </button>
          
        </div>
      </main>
    </div>
  );
};

export default App;