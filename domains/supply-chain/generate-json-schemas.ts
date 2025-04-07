import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';


const SCHEMAS_DIR = path.join(__dirname, '../schemas');
const OUTPUT_DIR = path.join(SCHEMAS_DIR, 'json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateSchemas() {
  const files = fs.readdirSync(SCHEMAS_DIR);

  for (const file of files) {
    if (file.endsWith('.ts') && file !== 'json') {
      console.log("Processing:", path.join(SCHEMAS_DIR, file));

      // Convert path to a valid file URL for ESM import
      const schemaModule = await import(pathToFileURL(path.join(SCHEMAS_DIR, file)).href);

      console.log("Schema module:", schemaModule);

      const schemaName = Object.keys(schemaModule).find((key) =>
        key.endsWith('Schema'),
      );

      if (schemaName && schemaModule[schemaName]) {
        const schema = schemaModule[schemaName];
        if (!schema || typeof schema !== 'object' || !schema[Symbol.for('TypeBox.Kind')]) {
          console.error(`❌ Invalid TypeBox schema in ${file}`);
          continue;
        }

        const outputFilePath = path.join(OUTPUT_DIR, `${file.replace('.ts', '.json')}`);

        fs.writeFileSync(outputFilePath, JSON.stringify(schema, null, 2), 'utf-8');

        console.log(`✅ Generated JSON schema: ${outputFilePath}`);
      } else {
        console.warn(`⚠️ No valid schema found in ${file}`);
      }
    }
  }
}

generateSchemas().catch(console.error);
