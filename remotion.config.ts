import { Config } from '@remotion/cli/config';

Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setEntryPoint('./src/root.tsx');
