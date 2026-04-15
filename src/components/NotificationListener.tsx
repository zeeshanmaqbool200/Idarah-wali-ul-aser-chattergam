import React, { useEffect, useRef } from 'react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNotifications } from '../services/notificationService';
import { Notification } from '../types';

import { logger } from '../lib/logger';

export default function NotificationListener() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const { showLocalNotification, permission } = useNotifications();
  const isFirstLoad = useRef(true);
  const lastNotifId = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen for the most recent notification
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      const latestNotif = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Notification;

      // Skip if it's the first load or we've already processed this notification
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        lastNotifId.current = latestNotif.id;
        logger.info('Notification Listener Active');
        return;
      }

      if (latestNotif.id === lastNotifId.current) {
        return;
      }

      lastNotifId.current = latestNotif.id;

      // Check if the notification is for this user
      const isTargeted = 
        latestNotif.targetType === 'all' ||
        (latestNotif.targetType === 'individual' && latestNotif.targetId === user.uid) ||
        (latestNotif.targetType === 'class' && latestNotif.targetId === user.grade);

      // Don't show if the user is the sender
      if (isTargeted && latestNotif.senderId !== user.uid) {
        if (!latestNotif.readBy.includes(user.uid)) {
          logger.db('New Notification Received', `notifications/${latestNotif.id}`, latestNotif);
          const prefs = user.notificationPrefs || { inAppToasts: true, push: true };

          // Show in-app toast if enabled
          if (prefs.inAppToasts) {
            showToast({
              title: latestNotif.title,
              message: latestNotif.message,
              type: latestNotif.type === 'fee_request' ? 'warning' : 'info',
              duration: 6000
            });
          }

          // Show system notification if enabled and permitted
          if (prefs.push && permission === 'granted') {
            showLocalNotification(latestNotif.title, {
              body: latestNotif.message,
              tag: latestNotif.id,
              data: { url: '/notifications' }
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, [user, showToast, showLocalNotification, permission]);

  return null;
}
