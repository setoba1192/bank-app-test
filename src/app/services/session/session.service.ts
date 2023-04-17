import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';

const SESSION_KEY = 'SESSION_KEY';
const LAST_DATE_KEY = 'LAST_DATE_KEY';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  async isActiveSession() {
    const { value: duration } = await Preferences.get({ key: SESSION_KEY });
    const { value: lastDayValue } = await Preferences.get({
      key: LAST_DATE_KEY,
    });
    if (!lastDayValue) {
      return false;
    }
    const lastDay: Date = new Date(JSON.parse(lastDayValue).date);

    const milliseconds = new Date().getTime() - lastDay.getTime();
    const sessionMinutes = Math.floor(milliseconds / 60000);
    console.log('minutes', sessionMinutes);

    return sessionMinutes <= Number(duration);
  }

  /**
   *
   * @param duration Duration in minutes
   */
  setSessionDuration(duration: number) {
    Preferences.set({ key: SESSION_KEY, value: JSON.stringify(duration) });
    Preferences.set({
      key: LAST_DATE_KEY,
      value: JSON.stringify({ date: new Date() }),
    });
  }

  clearAllData() {
    Preferences.clear();
    App.removeAllListeners();
  }
}
