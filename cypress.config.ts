import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('dotenv').config();
      config.env.BURGER_API_URL = process.env.BURGER_API_URL;
      return config;
    }
  }
});
