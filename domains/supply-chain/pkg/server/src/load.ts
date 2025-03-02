import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

export const load = async (
  filePath: string,
  sandbox: any,
  contextualize = false,
) => {
  const importedModule = require(filePath);

  if (typeof importedModule.default === 'function') {
    return importedModule.default(sandbox);
  }

  return importedModule.default;
};

export const loadDir = async (
  dir: string,
  sandbox: any,
  contextualize = false,
) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const container: Record<string, any> = {};
  const filePattern = /\.(ts|js)$/;

  for (const file of files) {
    const { name } = file;
    if (file.isFile() && !filePattern.test(file.name)) continue;
    const location = path.join(dir, name);
    const key = path.basename(name, path.extname(name));
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