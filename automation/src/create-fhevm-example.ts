import fs from 'fs-extra';
import path from 'path';
import { generateDocs } from './generate-docs';

async function createExample() {
    const args = process.argv.slice(2);
    const exampleName = args[0];

    // Parse --template argument
    let templateName = "EncryptedValue"; // Default
    const templateIndex = args.indexOf("--template");
    if (templateIndex !== -1 && args[templateIndex + 1]) {
        templateName = args[templateIndex + 1];
    }

    if (!exampleName) {
        console.error("Please provide an example name. Usage: npx ts-node src/create-fhevm-example.ts <example-name> [--template <TemplateName>]");
        process.exit(1);
    }

    const rootDir = path.resolve(__dirname, '../../');
    const baseTemplatePath = path.join(rootDir, 'base-template');
    const targetPath = path.join(rootDir, exampleName);

    console.log(`Creating new example: ${exampleName}`);
    console.log(`Template: ${templateName}`);
    console.log(`Source: ${baseTemplatePath}`);
    console.log(`Target: ${targetPath}`);

    try {
        // 1. Check if target exists
        if (await fs.pathExists(targetPath)) {
            console.error(`Error: Directory ${exampleName} already exists.`);
            process.exit(1);
        }

        // 2. Copy base template
        console.log("Copying base template...");
        await fs.copy(baseTemplatePath, targetPath, {
            filter: (src) => {
                // Don't copy node_modules or .git to save time/space
                return !src.includes('node_modules') && !src.includes('.git');
            }
        });

        // 3. Clean up default contracts and tests
        console.log("Cleaning up default files...");
        await fs.emptyDir(path.join(targetPath, 'contracts'));
        await fs.emptyDir(path.join(targetPath, 'test'));

        // 4. Inject Contract Template
        // We use the template name provided in args (or default)
        let contractName = templateName;
        const templatePath = path.join(__dirname, `../templates/${contractName}.sol`);

        if (await fs.pathExists(templatePath)) {
            console.log(`Injecting contract: ${contractName}.sol`);
            await fs.copy(templatePath, path.join(targetPath, 'contracts', `${contractName}.sol`));
        } else {
            console.warn(`Warning: Template ${contractName}.sol not found. Contracts directory is empty.`);
        }

        // 4.1 Inject Test Template
        const testTemplatePath = path.join(__dirname, `../templates/${contractName}.ts`);
        if (await fs.pathExists(testTemplatePath)) {
            console.log(`Injecting test: ${contractName}.ts`);
            await fs.copy(testTemplatePath, path.join(targetPath, 'test', `${contractName}.ts`));
        } else {
            console.warn(`Warning: Test Template ${contractName}.ts not found.`);
        }

        // 5. Update package.json
        console.log("Updating package.json...");
        const packageJsonPath = path.join(targetPath, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);

        packageJson.name = exampleName;
        packageJson.description = `FHEVM Example: ${exampleName}`;

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

        // 6. Generate Docs
        console.log("Generating documentation...");
        await generateDocs(targetPath);

        console.log(`\n✅ Example '${exampleName}' created successfully!`);
        console.log(`\nNext steps:`);
        console.log(`  cd ../${exampleName}`);
        console.log(`  npm install`);
        console.log(`  npx hardhat test`); // Note: Tests will fail until we generate them too!

    } catch (error) {
        console.error("Failed to create example:", error);
        process.exit(1);
    }
}

createExample();
