import fsp from 'node:fs/promises';
import path from 'node:path';

export const loadDir = async (dir) => {
  const files = await fsp.readdir(dir);
  const container = {};
  for (const fileName of files) {
    if (!fileName.includes('.ts')) continue;
    const filePath = path.join(dir, fileName);
    const name = path.basename(fileName, '.ts');
    const module = await import(filePath);
    container[name] = module[name];
  }
  return container;
};
