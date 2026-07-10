import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './public/store_screen';
const outputDir = './public/store_screen';

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace('.png', '.jpg'));

  const stats = fs.statSync(inputPath);
  console.log(`Processing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

  await sharp(inputPath)
    .resize(800, 600, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(outputPath);

  const newStats = fs.statSync(outputPath);
  console.log(`  -> ${file.replace('.png', '.jpg')} (${(newStats.size / 1024).toFixed(0)} KB)`);
}

console.log('Done! Now updating mockData.js to use .jpg files...');
