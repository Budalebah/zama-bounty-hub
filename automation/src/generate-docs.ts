import fs from 'fs-extra';
import path from 'path';

interface DocMetadata {
    title?: string;
    description: string[];
    chapter?: string;
    example?: string;
    pitfalls?: string[];
}

async function parseFile(filePath: string): Promise<DocMetadata> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const metadata: DocMetadata = {
        description: [],
        pitfalls: []
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('//')) continue;

        let comment = trimmed.substring(2).trim();
        if (comment.startsWith('/')) {
            comment = comment.substring(1).trim();
        }

        if (comment.startsWith('@title')) {
            metadata.title = comment.replace('@title', '').trim();
        } else if (comment.startsWith('@description')) {
            metadata.description.push(comment.replace('@description', '').trim());
        } else if (comment.startsWith('@chapter')) {
            metadata.chapter = comment.replace('@chapter', '').trim();
        } else if (comment.startsWith('@example')) {
            metadata.example = comment.replace('@example', '').trim();
        } else if (comment.startsWith('@pitfall')) {
            metadata.pitfalls?.push(comment.replace('@pitfall', '').trim());
        }
    }

    return metadata;
}

export async function generateDocs(targetDir: string) {
    console.log(`Generating documentation for: ${targetDir}`);

    const contractsDir = path.join(targetDir, 'contracts');
    const testsDir = path.join(targetDir, 'test');

    let mainMetadata: DocMetadata = { description: [], pitfalls: [] };

    // 1. Parse Contracts
    if (await fs.pathExists(contractsDir)) {
        const files = await fs.readdir(contractsDir);
        for (const file of files) {
            if (file.endsWith('.sol')) {
                const meta = await parseFile(path.join(contractsDir, file));
                // Merge metadata (preferring the first file found if multiple)
                if (!mainMetadata.title && meta.title) mainMetadata.title = meta.title;
                if (meta.description.length > 0) mainMetadata.description.push(...meta.description);
                if (meta.chapter) mainMetadata.chapter = meta.chapter;
            }
        }
    }

    // 2. Parse Tests (often contain pitfalls and usage examples)
    if (await fs.pathExists(testsDir)) {
        const files = await fs.readdir(testsDir);
        for (const file of files) {
            if (file.endsWith('.ts')) {
                const meta = await parseFile(path.join(testsDir, file));
                if (meta.pitfalls && meta.pitfalls.length > 0) {
                    mainMetadata.pitfalls?.push(...meta.pitfalls);
                }
                // Add test descriptions as well if needed
                if (meta.description.length > 0) {
                    // Maybe distinguish test descriptions? For now, add them.
                    mainMetadata.description.push(...meta.description);
                }
            }
        }
    }

    // 3. Generate Markdown
    if (!mainMetadata.title) {
        console.warn("No @title found in contracts. Skipping README generation.");
        return;
    }

    let markdown = `# ${mainMetadata.title}\n\n`;

    if (mainMetadata.chapter) {
        markdown += `**Chapter:** ${mainMetadata.chapter}\n\n`;
    }

    markdown += `## Description\n\n`;
    if (mainMetadata.description.length > 0) {
        // Remove duplicates
        const uniqueDesc = [...new Set(mainMetadata.description)];
        uniqueDesc.forEach(desc => {
            markdown += `${desc}\n\n`;
        });
    } else {
        markdown += `No description provided.\n\n`;
    }

    if (mainMetadata.pitfalls && mainMetadata.pitfalls.length > 0) {
        markdown += `## ⚠️ Common Pitfalls\n\n`;
        mainMetadata.pitfalls.forEach(pitfall => {
            markdown += `- ${pitfall}\n`;
        });
        markdown += `\n`;
    }

    markdown += `## How to Run\n\n`;
    markdown += `1. Install dependencies:\n`;
    markdown += `   \`\`\`bash\n   npm install\n   \`\`\`\n\n`;
    markdown += `2. Run tests:\n`;
    markdown += `   \`\`\`bash\n   npx hardhat test\n   \`\`\`\n`;

    // 4. Write README.md
    await fs.writeFile(path.join(targetDir, 'README.md'), markdown);
    console.log(`✅ README.md generated successfully in ${targetDir}`);
}

// Only run if called directly
if (require.main === module) {
    const targetDir = process.argv[2] || process.cwd();
    generateDocs(targetDir);
}
