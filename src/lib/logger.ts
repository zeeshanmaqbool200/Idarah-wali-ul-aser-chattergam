/**
 * Professional Styled Logger for Idarah Wali Ul Aser
 * Uses CSS styling in console for better developer experience and professionality.
 */

import { addDoc, collection, Firestore } from 'firebase/firestore';

const BRAND_COLOR = '#0d9488'; // Primary Teal
const SECONDARY_COLOR = '#0f766e';
const ERROR_COLOR = '#ef4444';
const WARN_COLOR = '#f59e0b';
const INFO_COLOR = '#3b82f6';

const getTimestamp = () => new Date().toLocaleTimeString();

let firestoreDb: Firestore | null = null;

export const initLoggerDb = (db: Firestore) => {
  firestoreDb = db;
};

const saveLogToDb = async (level: string, message: string, data?: any) => {
  if (!firestoreDb) return;
  try {
    // Avoid logging the log itself
    await addDoc(collection(firestoreDb, 'system_logs'), {
      level,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : null,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  } catch (e) {
    // Fail silently to avoid infinite loops
  }
};

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, data?: any) => {
    if (isDev) {
      console.log(
        `%c ℹ️ INFO %c [${getTimestamp()}] %c ${message}`,
        `background: ${INFO_COLOR}; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;`,
        'color: #6b7280; font-size: 0.8rem;',
        'color: #1f2937; font-weight: 500;',
        data || ''
      );
    }
    saveLogToDb('info', message, data);
  },

  success: (message: string, data?: any) => {
    if (isDev) {
      console.log(
        `%c ✅ SUCCESS %c [${getTimestamp()}] %c ${message}`,
        `background: ${BRAND_COLOR}; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;`,
        'color: #6b7280; font-size: 0.8rem;',
        'color: #065f46; font-weight: 600;',
        data || ''
      );
    }
    saveLogToDb('success', message, data);
  },

  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(
        `%c ⚠️ WARN %c [${getTimestamp()}] %c ${message}`,
        `background: ${WARN_COLOR}; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;`,
        'color: #6b7280; font-size: 0.8rem;',
        'color: #92400e; font-weight: 500;',
        data || ''
      );
    }
    saveLogToDb('warn', message, data);
  },

  error: (message: string, data?: any) => {
    // Always log errors to console but maybe sanitize data in prod
    console.error(
      `%c 🚨 ERROR %c [${getTimestamp()}] %c ${message}`,
      `background: ${ERROR_COLOR}; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;`,
      'color: #6b7280; font-size: 0.8rem;',
      'color: #991b1b; font-weight: 600;',
      isDev ? (data || '') : 'Sensitive data hidden in production'
    );
    saveLogToDb('error', message, data);
  },

  db: (operation: string, path: string, data?: any) => {
    if (isDev) {
      console.log(
        `%c 🔥 FIRESTORE %c [${getTimestamp()}] %c ${operation.toUpperCase()} %c ${path}`,
        `background: #ff6000; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;`,
        'color: #6b7280; font-size: 0.8rem;',
        'color: #ff6000; font-weight: 800;',
        'color: #4b5563; font-family: monospace;',
        data || ''
      );
    }
    saveLogToDb('db', `${operation}: ${path}`, data);
  },

  auth: (event: string, user?: any) => {
    if (isDev) {
      console.log(
        `%c 🔐 AUTH %c [${getTimestamp()}] %c ${event}`,
        `background: #6366f1; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;`,
        'color: #6b7280; font-size: 0.8rem;',
        'color: #4338ca; font-weight: 700;',
        user || ''
      );
    }
    saveLogToDb('auth', event, user);
  }
};
