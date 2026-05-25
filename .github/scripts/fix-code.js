import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  process.exit(1);
}

// Ignore directories that shouldn't be altered by the AI
const IGNORED_DIRS = ['.git', '.github', 'node_modules', 'dist', 'build', 'out'];
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const resPath = path.join(dirPath, file);
    if (fs.statSync(resPath).isDirectory()) {
      if (!IGNORED_DIRS.includes(file)) {
        getAllFiles(resPath, arrayOfFiles);
      }
    } else {
      if (ALLOWED_EXTENSIONS.includes(path.extname(file))) {
        arrayOfFiles.push(resPath);
      }
    }
  });

  return arrayOfFiles;
}

async function fixFileWithGemini(filePath) {
  console.log(`Processing: ${filePath}`);
  const originalContent = fs.readFileSync(filePath, 'utf-8');

  const payload = {
    contents: [{
      parts: [{
        text: `You are an expert software engineer. Analyze the following code file (${filePath}). Fix any syntax errors, type compliance failures, logical bugs, formatting anomalies, or runtime hazards. 

CRITICAL: Return ONLY the raw, updated code file content. Do NOT wrap it in markdown code blocks (\`\`\`), do NOT provide descriptions, explanations, or introductory text. If the file requires no modifications, return the original text exactly.

Original Code:
${originalContent}`
      }]
    }]
  };

  try {
    // Calling the Gemini 2.5 Flash model endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    let fixedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (fixedContent) {
      // Clean up accidental markdown backticks if the model ignores system instructions
      if (fixedContent.startsWith('```')) {
        fixedContent = fixedContent.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
      }

      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      console.log(`Successfully updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error);
  }
}

async function main() {
  const files = getAllFiles('.');
  console.log(`Found ${files.length} valid target files for optimization.`);
  
  for (const file of files) {
    await fixFileWithGemini(file);
    // 1-second delay to safely respect general API rate constraints
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main();
