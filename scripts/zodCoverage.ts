// // eslint-disable @typescript-eslint/no-unused-expressions
//
// import { Project, SyntaxKind } from 'ts-morph';
// import * as fs from 'fs';
// import { execSync } from 'child_process';
//
//
// const hasZodSchema = (node: any): boolean => {
//   // Get the parameters of the function/method
//   const parameters = node.getParameters();
//
//   return parameters.some((parameter: any) => {
//     const typeName = parameter.getType().getText();
//     const typeSymbol = parameter.getType().getSymbol();
//
//     if (typeSymbol) {
//       const typeDeclaration = typeSymbol.getDeclarations()[0];
//       if (typeDeclaration && typeDeclaration.getKind() === SyntaxKind.ClassDeclaration) {
//         const classDeclaration = typeDeclaration as any;
//         const staticProperties = classDeclaration.getStaticMembers();
//
//         const hasZodProperty = staticProperties.some((property: any) => {
//           return property.getName() === 'isZodDto';
//         });
//
//         return hasZodProperty;
//       }
//     }
//
//     return false;
//   });
// };
//
// const shouldUseZod = (method: any): boolean => {
//   const parameters = method.getParameters();
//
//   return parameters.some((parameter: any) => {
//     const decorators = parameter.getDecorators();
//     return decorators.some((decorator: any) => {
//       const decoratorName = decorator.getName();
//       return decoratorName === 'Body' || decoratorName === 'Query';
//     });
//   });
// };
//
// const analyzeControllers = (files: string[]) => {
//   const project = new Project();
//   project.addSourceFilesAtPaths(files);
//   const endpointData: { controller: string; endpoint: string; hasZodSchema: boolean }[] = [];
//   project.getSourceFiles().forEach(sourceFile => {
//     const fileName = sourceFile.getFilePath();
//
//     sourceFile.getClasses().forEach(classDeclaration => {
//       const className = classDeclaration.getName();
//       if (className) {
//         const methods = classDeclaration.getMethods();
//         methods.forEach(method => {
//           const methodName = method.getName();
//           const decorators = method.getDecorators();
//
//           decorators.forEach(decorator => {
//             const decoratorName = decorator.getName();
//             if (['Get', 'Post', 'Put', 'Delete', 'Patch'].includes(decoratorName)) {
//
//               const endpoint = decorator.getArguments().map(arg => arg.getText()).join(', ');
//               // Check if the method should use Zod based on @Body or @Query decorators
//               if (shouldUseZod(method)) {
//                 const hasSchema = hasZodSchema(method);
//
//                 console.log(`Controller: ${className}, Endpoint: ${endpoint}, Uses Zod: ${hasSchema}`);
//
//                 endpointData.push({
//                   controller: className,
//                   endpoint: `${decoratorName} ${endpoint}`,
//                   hasZodSchema: hasSchema
//                 });
//               }
//             }
//           });
//         });
//       }
//     });
//   });
//
//   return endpointData;
// };
//
// // Function to generate a report
// const generateReport = (endpointData: { controller: string; endpoint: string; hasZodSchema: boolean }[]) => {
//   const reportLines = endpointData.map(data => {
//     `${data.controller} - ${data.endpoint}: ${data.hasZodSchema ? 'Has Zod Schema' : 'No Zod Schema'}`
//     if (data.hasZodSchema) {
//     console.log(`${data.controller} - ${data.endpoint}: ${data.hasZodSchema ? 'Has Zod Schema' : 'No Zod Schema'}`)
//         }
//     });
//   fs.writeFileSync('endpoint_report.txt', reportLines.join('\n'));
//   console.log('Report generated: endpoint_report.txt');
// };
//
// // Main function to run the script
// const main = () => {
//   const args = process.argv.slice(2);
//   const mode = args[0]; // 'global' or 'changes'
//
//   if (mode === 'global') {
//     const files = ['../server/**/*.controller.ts']; // Adjust the path to your controllers
//     const endpointData = analyzeControllers(files);
//     generateReport(endpointData);
//   } else if (mode === 'changes') {
//     const changedFiles = execSync('git diff --name-only HEAD~1').toString().split('\n').filter(f => f.endsWith('.ts'));
//     if (changedFiles.length > 0) {
//       const endpointData = analyzeControllers(changedFiles);
//     // eslint-disable-next-line
//        generateReport(endpointData);
//     } else {
//       console.log('No TypeScript files have changed.');
//     }
//   } else {
//     console.error('Invalid mode. Use "global" or "changes".');
//     process.exit(1);
//   }
// };
//
// main();
