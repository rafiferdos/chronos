import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD (start date)
  endDate: string; // YYYY-MM-DD (end date)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  assignedTo?: string;
  assignToMe: boolean;
  note?: string;
  reminders: string[]; // e.g. ['5 minutes before', '1 hour before']
  recurring?: 'daily' | 'weekly' | 'monthly' | 'annually' | null;
  includedMembers: string[];
  color?: 'red' | 'purple' | 'blue' | 'green';
  createdAt: string;
}

interface EventsContextType {
  events: CalendarEvent[];
  isLoading: boolean;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => Promise<CalendarEvent>;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventsByMonth: (year: number, month: number) => CalendarEvent[];
  getDatesWithEvents: (year: number, month: number) => Set<string>;
}

const STORAGE_KEY = 'chronos_events';

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from storage on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEvents(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load events', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Save events to storage whenever they change
  const saveEvents = useCallback(async (newEvents: CalendarEvent[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch (error) {
      console.error('Failed to save events', error);
    }
  }, []);

  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<CalendarEvent> => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    await saveEvents(newEvents);
    return newEvent;
  }, [events, saveEvents]);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    const newEvents = events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    );
    setEvents(newEvents);
    await saveEvents(newEvents);
  }, [events, saveEvents]);

  const deleteEvent = useCallback(async (id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    setEvents(newEvents);
    await saveEvents(newEvents);
  }, [events, saveEvents]);

  const getEventsByDate = useCallback((date: string): CalendarEvent[] => {
    return events.filter(event => event.date === date).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  }, [events]);

  const getEventsByMonth = useCallback((year: number, month: number): CalendarEvent[] => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    return events.filter(event => event.date.startsWith(monthStr));
  }, [events]);

  const getDatesWithEvents = useCallback((year: number, month: number): Set<string> => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const dates = new Set<string>();
    events.forEach(event => {
      if (event.date.startsWith(monthStr)) {
        dates.add(event.date);
      }
    });
    return dates;
  }, [events]);

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsByDate,
        getEventsByMonth,
        getDatesWithEvents,
      }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
