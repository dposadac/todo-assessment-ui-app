import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.accenture.todoassessment',
  appName: 'Todo Assessment',
  webDir: 'dist/todo-assessment-app/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
