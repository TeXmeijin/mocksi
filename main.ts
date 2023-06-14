import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { getTypesFromFile } from './getTypesFromFile';
import { createMockGeneratorFunction } from './createMockGeneratorFunction';
import * as ts from 'typescript';

const program = new Command();

program
  .option('-d, --directory <type>', 'input directory')
  .action((options) => {
    const filePaths = fs.readdirSync(options.directory)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.mock.ts'))
      .map(file => path.join(options.directory, file));
    for (const filePath of filePaths) {
      const types = getTypesFromFile(filePath);
      const program = ts.createProgram([filePath], {});
      const checker = program.getTypeChecker();
      for (const type of types) {
        const mockFunction = createMockGeneratorFunction(type, checker, filePath);
        const mockFilePath = filePath.replace('.ts', '.mock.ts');
        fs.writeFileSync(mockFilePath, mockFunction, 'utf8');
      }
    }
  });

program.parse(process.argv);

