import * as ts from 'typescript';

function getTypesFromFile(filePath: string) {
    const program = ts.createProgram([filePath], {});
    const checker = program.getTypeChecker();

    const visit = (node: ts.Node, types: { name: string, type: ts.Type }[]) => {
        if (ts.isTypeAliasDeclaration(node) && node.modifiers) {
            const symbol = checker.getSymbolAtLocation(node.name)!;
            const type = checker.getDeclaredTypeOfSymbol(symbol);
            types.push({
                name: node.name.text,
                type
            });
        }
        ts.forEachChild(node, (child) => visit(child, types));
    };

    const types: { name: string, type: ts.Type }[] = [];
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            ts.forEachChild(sourceFile, childNode => visit(childNode, types));
        }
    }
    return types;
}

export {
  getTypesFromFile
}
