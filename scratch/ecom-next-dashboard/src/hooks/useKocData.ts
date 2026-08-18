"use client";

import { useState, useEffect, useMemo } from 'react';
import { KocLiveSession } from '@/lib/koc-service';

export interface FileMetadata {
  name: string;
  brand: string;
  count: number;
  dateRange: { start: string; end: string };
  uploadDate: string;
}

export function useKocData() {
  const [sessions, setSessions] = useState<KocLiveSession[]>([]);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('koc_sessions');
    const savedFiles = localStorage.getItem('koc_files');
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse sessions from localStorage", e);
      }
    }
    
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (e) {
        console.error("Failed to parse files from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('koc_sessions', JSON.stringify(sessions));
      localStorage.setItem('koc_files', JSON.stringify(files));
    }
  }, [sessions, files, isLoaded]);

  const addData = (newSessions: KocLiveSession[], fileName: string, brand: string) => {
    if (newSessions.length === 0) return;

    // 1. Calculate metadata for the new file
    const dates = newSessions.map(s => s.date).sort();
    const metadata: FileMetadata = {
      name: fileName,
      brand: brand,
      count: newSessions.length,
      dateRange: { start: dates[0], end: dates[dates.length - 1] },
      uploadDate: new Date().toISOString(),
    };

    // 2. Add fileName and brand to each session for tracking
    const sessionsWithFile = newSessions.map(s => ({ ...s, fileName, brand }));

    // 3. Update states
    setFiles(prev => [...prev, metadata]);
    setSessions(prev => {
      // Avoid exact duplicate sessions (creator + start time)
      const existingIds = new Set(prev.map(s => `${s.creatorId}-${s.startTime}`));
      const uniqueNew = sessionsWithFile.filter(s => !existingIds.has(`${s.creatorId}-${s.startTime}`));
      return [...prev, ...uniqueNew];
    });
  };

  const deleteFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    setSessions(prev => prev.filter(s => s.fileName !== fileName));
  };

  const clearAll = () => {
    setSessions([]);
    setFiles([]);
    localStorage.removeItem('koc_sessions');
    localStorage.removeItem('koc_files');
  };

  return {
    sessions,
    files,
    isLoaded,
    addData,
    deleteFile,
    clearAll
  };
}
