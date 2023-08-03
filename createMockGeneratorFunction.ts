import * as ts from 'typescript';
import * as path from 'path'

function createMockGeneratorFunction(typeInfo: { name: string, type: ts.Type }, checker: ts.TypeChecker, filePath: string) {
    const properties = typeInfo.type.getProperties();
    let mockFunction = `import { faker } from '@faker-js/faker';\n`;
    mockFunction += `import { ${typeInfo.name} } from './${path.basename(filePath, '.ts')}';\n\n`;
    mockFunction += `export const createMock${typeInfo.name}: (data: Partial<${typeInfo.name}>) => ${typeInfo.name} = (data) => {\n`;
    mockFunction += '  return {\n';
    for (const property of properties) {
        const propertyName = property.name;
        if (property.valueDeclaration) {
            const type = checker.getTypeAtLocation(property.valueDeclaration);
            if (type.flags === ts.TypeFlags.String) {
                mockFunction += `    ${propertyName}: faker.random.word(),\n`;
            } else if (type.flags === ts.TypeFlags.Number) {
                mockFunction += `    ${propertyName}: faker.random.number(),\n`;
            }
        }
        // Add more types if needed
    }
    mockFunction += '    ...data\n';
    mockFunction += '  }\n';
    mockFunction += '}\n';
    return mockFunction;
}

export {
  createMockGeneratorFunction
}
