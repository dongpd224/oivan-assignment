import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run web:serve',
        production: 'npx nx run web:serve:production',
      },
      ciWebServerCommand: 'npx nx run web:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
    specPattern: 'src/e2e/**/*.cy.ts',
    supportFile: 'src/support/e2e.ts',
    fixturesFolder: 'src/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
