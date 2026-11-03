import './bundle.mjs';
import './plicy-navigation.mjs';
import { outputDirectory } from '../scripts/build-plicy.mjs';
process.env.DRILL_ROOT = outputDirectory;
process.env.TEST_UNKNOWN_MIME = '1';
process.env.TEST_PLICY_HOST = '1';
await import('./browser-security.mjs');
