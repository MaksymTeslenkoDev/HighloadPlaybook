import { TypeCompiler } from '@sinclair/typebox/compiler';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const load = async (filePath, sandbox, contextualize = false) => {
  const moduleURL = pathToFileURL(filePath).href;
  const importedModule = await import(moduleURL);

  if (typeof importedModule.default === 'function') {
    return importedModule.default(sandbox);
  }

  return importedModule.default;
};

export const loadDir = async (dir, sandbox, contextualize = false) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const container = {};
  for (const file of files) {
    const { name } = file;
    if (file.isFile() && !name.endsWith('.ts')) continue;
    const location = path.join(dir, name);
    const key = path.basename(name, '.ts');
    const loader = file.isFile() ? load : loadDir;
    container[key] = await loader(location, sandbox, contextualize);
  }
  return container;
};

export function flatObject(
  basePath: string,
  obj: any,
  result: Record<string, any> = {},
) {
  for (const key in obj) {
    const newPath = basePath ? `${basePath}:${key}` : key;
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      key != 'params' &&
      key != 'returns' &&
      !obj.hasOwnProperty('type')
    ) {
      flatObject(newPath, obj[key], result);
    } else {
      result[newPath] = obj[key];
    }
  }
  return result;
}
