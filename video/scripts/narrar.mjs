// Gera a narração (pt-BR) de cada cena e registra a duração de cada áudio.
//
// Modo ElevenLabs (gera os áudios pela API):
//   ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... node scripts/narrar.mjs
//   Opcional: ELEVENLABS_MODEL (padrão eleven_multilingual_v2), --somente=05-busca,06-resultado
//
// Modo manual (áudios feitos no site da ElevenLabs, Higgsfield etc.):
//   salve um mp3 por cena em public/narracao/<id>.mp3 (ids em narracao/roteiro.json) e rode
//   node scripts/narrar.mjs --somente-duracoes
//
// Em ambos os modos, as durações vão para src/narration.generated.json e o vídeo
// estica cada cena para caber a fala.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const roteiro = JSON.parse(readFileSync(join(root, 'narracao/roteiro.json'), 'utf8'));
const outDir = join(root, 'public/narracao');
mkdirSync(outDir, {recursive: true});

const args = process.argv.slice(2);
const onlyDurations = args.includes('--somente-duracoes');
const onlyArg = args.find((a) => a.startsWith('--somente='));
const only = onlyArg ? onlyArg.split('=')[1].split(',') : null;

const generate = async (id, text) => {
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  if (!key || !voice) {
    throw new Error('Defina ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID (ou use --somente-duracoes).');
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg'},
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
        voice_settings: {stability: 0.5, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true},
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} em ${id}: ${await res.text()}`);
  writeFileSync(join(outDir, `${id}.mp3`), Buffer.from(await res.arrayBuffer()));
};

const durationOf = (file) =>
  Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])
      .toString()
      .trim(),
  );

const durations = {};
for (const [id, text] of Object.entries(roteiro)) {
  const file = join(outDir, `${id}.mp3`);
  if (!onlyDurations && (!only || only.includes(id))) {
    process.stdout.write(`Gerando ${id}… `);
    await generate(id, text);
    console.log('ok');
  }
  if (existsSync(file)) durations[id] = Math.round(durationOf(file) * 100) / 100;
}

writeFileSync(join(root, 'src/narration.generated.json'), JSON.stringify(durations, null, 2) + '\n');
console.log(`Durações registradas para ${Object.keys(durations).length} de ${Object.keys(roteiro).length} cenas.`);
