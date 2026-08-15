import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';

async function generateEmbeddings() {
  console.log('🧠 [Embeddings Builder] Loading Xenova/all-MiniLM-L6-v2 pipeline...');
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
  });

  const indexPath = path.resolve('public/index.json');
  if (!fs.existsSync(indexPath)) {
    throw new Error('public/index.json not found! Run python build.py first.');
  }

  const catalog = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const questions = catalog.questions || [];
  console.log(`📄 Found ${questions.length} questions in catalog.`);

  const questionIds = [];
  const texts = [];

  for (const q of questions) {
    const tags = Array.isArray(q.tags) ? q.tags.join(', ') : '';
    const text = `${q.title}. Topic: ${q.topic}. Difficulty: ${q.difficulty}. Format: ${q.format || 'Open Answer'}. Tags: ${tags}.`;
    texts.push(text);
    questionIds.push(q.id);
  }

  console.log(`⚡ Generating 384-d normalized embeddings in batches...`);
  const vectors = [];
  const batchSize = 32;
  const startTime = Date.now();

  for (let i = 0; i < texts.length; i += batchSize) {
    const batchTexts = texts.slice(i, i + batchSize);
    for (const text of batchTexts) {
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      const rawVector = Array.from(output.data);
      // Round to 5 decimal places for 50% smaller JSON footprint without loss of ranking precision
      const compactVector = rawVector.map((val) => Math.round(val * 100000) / 100000);
      vectors.push(compactVector);
    }
    const percent = Math.min(100, Math.round(((i + batchTexts.length) / texts.length) * 100));
    process.stdout.write(`\rProgress: ${percent}% (${Math.min(i + batchSize, texts.length)}/${texts.length})`);
  }

  console.log(`\n✅ Generated ${vectors.length} embeddings in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  const outputData = {
    model: 'Xenova/all-MiniLM-L6-v2',
    dim: 384,
    count: vectors.length,
    ids: questionIds,
    vectors: vectors,
  };

  const outputPath = path.resolve('public/embeddings.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData), 'utf-8');
  const sizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
  console.log(`💾 Saved embeddings to public/embeddings.json (${sizeMb} MB)`);
}

generateEmbeddings().catch((err) => {
  console.error('❌ Failed to generate embeddings:', err);
  process.exit(1);
});
