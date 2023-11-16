import path from 'path';
import url from 'url'; //para obtener el directorio actual

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
