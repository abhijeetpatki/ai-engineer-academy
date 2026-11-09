export type ConceptMode = 'simple' | 'qa_analogy' | 'deep_dive';

export interface FlowchartNode {
  id: string;
  label: string;
  sublabel: string;
  category: 'input' | 'process' | 'model' | 'eval' | 'output' | 'guardrail';
  description: string;
  qaTakeaway: string;
  metrics?: string;
}

export interface InteractiveFlowchartSpec {
  id: string;
  title: string;
  subtitle: string;
  nodes: FlowchartNode[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  qaBridgeTip: string;
  tag: string;
}

export interface PromptComparisonScenario {
  id: string;
  title: string;
  useCase: string;
  weakPrompt: string;
  weakOutput: string;
  weakFlaws: string[];
  engineeredPrompt: string;
  engineeredOutput: string;
  improvements: string[];
  metricsDelta: {
    hallucinationRisk: string;
    schemaCompliance: string;
    determinismScore: string;
  };
}

export interface LessonItem {
  id: string;
  trackId: string;
  title: string;
  durationMinutes: number;
  summary: string;
  modes: {
    simple: {
      headline: string;
      explanation: string;
      keyTakeaways: string[];
    };
    qa_analogy: {
      headline: string;
      oldQaWorld: string;
      newAiWorld: string;
      unfairAdvantage: string;
      explanation: string;
    };
    deep_dive: {
      headline: string;
      explanation: string;
      codeSnippet: string;
      codeLanguage: string;
      productionNotes: string[];
    };
  };
}

export interface TrackModule {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  badgeTitle: string;
  estimatedHours: string;
  qaSuperpowerTag: string;
  overview: string;
  flowchart: InteractiveFlowchartSpec;
  lessons: LessonItem[];
  flashcards: FlashcardItem[];
  promptSandbox?: PromptComparisonScenario[];
  pulseCards?: PulseTrendCard[];
}

export interface PulseTrendCard {
  id: string;
  title: string;
  category: 'Reasoning' | 'Agentic Coding' | 'Multimodal Live' | 'Edge & SLMs' | 'Governance & Safety' | 'Certification Path';
  maturity: string;
  summary: string;
  whyQaCares: string;
  keyTech: string[];
  externalUrl?: string;
  externalLabel?: string;
}

export interface ExamQuestion {
  id: string;
  trackId: string;
  domain: 'AI & LLM Fundamentals' | 'Anthropic Claude & MCP' | 'Google Cloud & Gemini' | 'RAG & Agentic Workflows' | 'AI Evals & Red Teaming';
  difficulty: 'Foundation' | 'Practitioner' | 'Architect';
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  qaPerspective: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  loveNote: string;
  unlockCriteria: string;
  category: 'track' | 'exam' | 'lab' | 'streak';
}

export interface InterviewQuestionItem {
  id: string;
  category: 'LLM Internals' | 'RAG & Vector Systems' | 'Agents & MCP' | 'AI Evals & Red Teaming (QA-to-AI Special)';
  difficulty: 'Mid-Level' | 'Senior' | 'Staff / Principal';
  questionTitle: string;
  scenarioQuestion: string;
  whyTheyAsk: string;
  proAnswer: string;
  codeOrFormula?: string;
  hiringManagerRubric: {
    strongSignal: string[];
    redFlags: string[];
    qaEdgeHighlight: string;
  };
}

export interface JargonTermItem {
  id: string;
  term: string;
  category: 'Core LLM' | 'RAG & Search' | 'Agents & Protocols' | 'Evals & Security' | 'Optimization';
  pronunciationOrTag: string;
  plainEnglish: string;
  qaAnalogy: {
    analogyTitle: string;
    comparison: string;
    qaRuleOfThumb: string;
  };
  productionCode: {
    language: string;
    snippet: string;
    note: string;
  };
}

export interface OfficialDocResource {
  id: string;
  provider: 'Anthropic' | 'Google Cloud & Gemini' | 'OpenAI & Industry Evaluation Standards';
  title: string;
  url: string;
  difficulty: 'Essential' | 'Intermediate' | 'Advanced Production';
  estimatedReadTime: string;
  whyReadThis: string;
  qaToAiTakeaway: string;
  tags: string[];
}

export interface LabRubricCheck {
  id: string;
  dimension: 'technical' | 'structure' | 'safety' | 'evalRigor';
  label: string;
  points: number;
  patterns: string[]; // regex or keyword patterns (case-insensitive)
  hintIfMissing: string;
}

export interface PracticalLabTask {
  id: string;
  taskNumber: number;
  title: string;
  subtitle: string;
  trackBadge: string;
  difficulty: 'Practitioner' | 'Senior AI Engineer' | 'Staff AI Architect';
  estimatedMinutes: number;
  scenarioBrief: string;
  requirements: string[];
  starterTemplate: string;
  exemplarSolution: string;
  rubricChecks: LabRubricCheck[];
}

export interface LabScoreBreakdown {
  technical: number; // out of 30
  structure: number; // out of 25
  safety: number;    // out of 25
  evalRigor: number; // out of 20
  total: number;     // out of 100
  passedChecks: string[];
  missingHints: string[];
  verdictTitle: string;
  encouragementNote: string;
}
