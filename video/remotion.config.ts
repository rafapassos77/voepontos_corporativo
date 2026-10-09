import {Config} from '@remotion/cli/config';
Config.setEntryPoint('src/index.ts');
// Usa o Chromium já instalado no ambiente quando existir (sem download)
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
