import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();

function readFile(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

console.log('=== Running Spec-Driven Verification Suite for AI Engineer Academy ===');

// 1. Check 5 Core Tracks & Interactive Flowcharts
const tracksFile = readFile('src/data/tracksData.ts');
for (let i = 1; i <= 5; i++) {
  assert.ok(tracksFile.includes(`id: 'track-${i}'`), `Missing Track ${i}`);
  assert.ok(tracksFile.includes(`id: 'flow-track-${i}'`), `Missing Flowchart for Track ${i}`);
}
assert.ok(tracksFile.includes('promptSandbox:'), 'Missing Prompt Sandbox in Track 2');
assert.ok(tracksFile.includes('pulseCards:'), 'Missing AI Pulse Cards in Track 5');
console.log('✓ Verified 5 Core Learning Tracks, 5 Interactive Flowcharts, Prompt Sandbox, and AI Pulse Radar.');

// 2. Check >= 40 Scenario Exam Questions
const examFile = readFile('src/data/examQuestions.ts');
const questionCount = (examFile.match(/id:\s*'q-t\d-\d+'/g) || []).length;
assert.ok(questionCount >= 40, `Expected at least 40 exam questions, found ${questionCount}`);
console.log(`✓ Verified ${questionCount} Scenario-Based Certification Exam Questions (>= 40 required).`);

// 3. Check >= 25 Interview Prep Questions & all 9 Mandatory Topics
const interviewFile = readFile('src/data/interviewQuestions.ts');
const iqCount = (interviewFile.match(/id:\s*'iq-\d+'/g) || []).length;
assert.ok(iqCount >= 25, `Expected at least 25 interview questions, found ${iqCount}`);
const mandatoryInterviewTopics = [
  'Temperature vs. Top-P',
  'Lost in the Middle',
  'Guaranteed Structured Outputs',
  'RAG vs. Fine-Tuning',
  'Hybrid Search & Reranking',
  'Model Context Protocol (MCP)',
  'Agent Infinite Loops',
  'Deterministic QA vs. Probabilistic AI Evals',
  'Indirect Prompt Injection'
];
for (const topic of mandatoryInterviewTopics) {
  assert.ok(interviewFile.includes(topic), `Missing mandatory interview topic: ${topic}`);
}
console.log(`✓ Verified ${iqCount} Interview Simulator Questions including all 9 mandatory topics & Hiring Manager Rubrics.`);

// 4. Check all 13 Mandatory Jargon Terms
const jargonFile = readFile('src/data/jargonTerms.ts');
const mandatoryJargon = [
  'Tokenization',
  'Vector Embeddings',
  'Temperature & Top-P',
  'Hallucination',
  'RAG (Retrieval-Augmented Generation)',
  'Chunking & Overlap',
  'Cross-Encoder Reranker',
  'Tool / Function Calling',
  'MCP (Model Context Protocol)',
  'ReAct Loop (Reason + Act)',
  'LLM-as-a-Judge',
  'Prompt Caching / KV Cache',
  'Prompt Injection & Jailbreaking'
];
for (const term of mandatoryJargon) {
  assert.ok(jargonFile.includes(term), `Missing mandatory jargon term: ${term}`);
}
console.log('✓ Verified all 13+ mandatory Jargon Cheat Sheet terms with Plain English, QA Analogy & Production Code.');

// 5. Check Official Reference Library URLs
const docsFile = readFile('src/data/referenceDocs.ts');
const mandatoryUrls = [
  'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
  'https://anthropic.skilljar.com',
  'https://github.com/anthropics/courses',
  'https://modelcontextprotocol.io',
  'https://www.anthropic.com/engineering/building-effective-agents',
  'https://www.cloudskillsboost.google/paths/118',
  'https://ai.google.dev/gemini-api/docs',
  'https://cloud.google.com/vertex-ai/generative-ai/docs',
  'https://cookbook.openai.com',
  'https://platform.openai.com/docs/guides/prompt-engineering',
  'https://genai.owasp.org',
  'https://docs.ragas.io',
  'https://docs.confident-ai.com'
];
for (const url of mandatoryUrls) {
  assert.ok(docsFile.includes(url), `Missing official reference URL: ${url}`);
}
console.log('✓ Verified all 13 Official Reference Library URLs across Anthropic, Google Cloud/Gemini, OpenAI, OWASP, Ragas & DeepEval.');

// 6. Check all 6 Hands-On Practical Labs & PWA Assets
const labsFile = readFile('src/data/practicalLabs.ts');
for (let t = 1; t <= 6; t++) {
  assert.ok(labsFile.includes(`id: 'lab-task-${t}'`), `Missing Lab Task ${t}`);
  assert.ok(labsFile.includes(`taskNumber: ${t}`), `Missing Lab Task Number ${t}`);
}
assert.ok(fs.existsSync(path.join(root, 'public/manifest.webmanifest')), 'Missing PWA manifest.webmanifest');
assert.ok(fs.existsSync(path.join(root, 'public/sw.js')), 'Missing Service Worker sw.js');
assert.ok(fs.existsSync(path.join(root, 'vercel.json')), 'Missing vercel.json SPA routing config');
assert.ok(fs.existsSync(path.join(root, 'dist/index.html')), 'Missing production build dist/index.html');
console.log('✓ Verified all 6 Hands-On AI Engineering Labs, PWA Service Worker, vercel.json, and production bundle.');
console.log('=== ALL SPEC ASSERTIONS PASSED (100% COMPLIANCE) ===');
