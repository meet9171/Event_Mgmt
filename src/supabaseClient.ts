// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Comprehensive type definitions
export interface UserBadgeData {
  [key: string]: string | number;
  NAME: string;
  EMAIL: string;
  EVENTID: string;
  OTHER?: any;
}

export interface BadgeTemplateElement {
  x: number;
  y: number;
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'image';
  color: string;
  width: number;
  height: number;
  content: string;
  fontSize: number;
  isCustom: boolean;
  fontFamily: string;
}

export interface BadgeTemplate {
  id: number;
  event_id: string;
  name: string;
  aspectHeight: number;
  aspectWidth: number;
  aspectRatio: number;
  orientation: string;
  paperSize: string;
  elements: BadgeTemplateElement[];
}

// Utility function for type-safe Supabase queries
export async function querySupabase<T>(
  table: string, 
  method: 'select' | 'insert' | 'update' | 'delete',
  query?: any
) {
  try {
    const supabaseQuery = supabase
      .from(table)
      [method](query);

    const { data, error } = await supabaseQuery;

    if (error) throw error;

    return data as T;
  } catch (error) {
    console.error(`Supabase ${method} error:`, error);
    throw error;
  }
}