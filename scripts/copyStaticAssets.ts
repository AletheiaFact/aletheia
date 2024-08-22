import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as shell from 'shelljs';

// Função para carregar JSON de um arquivo
function loadJson(filePath: string): any {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

// Função para salvar JSON em um arquivo
function saveJson(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Função para realizar o deep merge dos arquivos JSON
function mergeJsonFiles(defaultFilePath: string, overrideFilePath: string, distFilePath: string): void {
  const defaultJson = loadJson(defaultFilePath);
  const overrideJson = loadJson(overrideFilePath);

  if (defaultJson) {
    let mergedJson;
    if (overrideJson) {
      mergedJson = _.merge({}, defaultJson, overrideJson);
    } else {
      mergedJson = defaultJson;
    }
    saveJson(distFilePath, mergedJson);
    console.log(`Arquivo JSON salvo: ${distFilePath}`);
  }
}

// Função para sobrescrever arquivos de imagem e SVG
function replaceFile(defaultFilePath: string, overrideFilePath: string, distFilePath: string): void {
  const dir = path.dirname(distFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Diretório criado: ${dir}`);
  }

  if (fs.existsSync(overrideFilePath)) {
    fs.copyFileSync(overrideFilePath, distFilePath);
    console.log(`Arquivo sobrescrito: ${distFilePath}`);
  } else {
    fs.copyFileSync(defaultFilePath, distFilePath);
    console.log(`Arquivo copiado: ${distFilePath}`);
  }
}

// Função para percorrer as pastas e realizar o merge/sobrescrição
function processDirectory(defaultDir: string, overrideDir: string, distDir: string): void {
  if (!fs.existsSync(defaultDir)) {
    console.error(`Diretório padrão não encontrado: ${defaultDir}`);
    return;
  }
  if (!fs.existsSync(overrideDir)) {
    console.warn(`Diretório de sobrescrição não encontrado: ${overrideDir}`);
  }

  fs.readdirSync(defaultDir).forEach(file => {
    const defaultFilePath = path.join(defaultDir, file);
    const overrideFilePath = path.join(overrideDir, file);
    const distFilePath = path.join(distDir, file);

    if (fs.lstatSync(defaultFilePath).isDirectory()) {
      // Recursão para subdiretórios
      processDirectory(defaultFilePath, overrideFilePath, distFilePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      console.log(`Processando arquivo: ${file} com extensão: ${ext}`);
      if (ext === '.json') {
        mergeJsonFiles(defaultFilePath, overrideFilePath, distFilePath);
      } else if (['.img', '.svg', '.png', '.ico'].includes(ext)) {
        console.log(`Tentando sobrescrever ${ext} com arquivo: ${overrideFilePath}`);
        replaceFile(defaultFilePath, overrideFilePath, distFilePath);
      }
    }
  });
}

// Caminhos das pastas raiz
const defaultRootDir = path.join(__dirname, '..', 'public');
const overrideRootDir = path.join(__dirname, '..', 'config', 'public');
const distRootDir = path.join(__dirname, '..', 'dist', 'public');

// Inicia o processo de cópia
console.log('Copiando estrutura de diretórios...');
shell.cp('-R', path.join(__dirname, '..', 'public'), path.join(__dirname, '..', 'dist'));

// Inicia o processo de merge e sobrescrição
console.log('Mesclando e sobrescrevendo arquivos...');
processDirectory(defaultRootDir, overrideRootDir, distRootDir);

console.log('Processo de sobrescrição completo!');
