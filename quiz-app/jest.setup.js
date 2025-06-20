import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

if (!global.TextEncoder) {
    global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
    global.TextDecoder = TextDecoder;
}