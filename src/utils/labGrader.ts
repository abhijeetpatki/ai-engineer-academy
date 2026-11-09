import { LabScoreBreakdown, PracticalLabTask } from '../types/academy';

export function gradeLabSubmission(task: PracticalLabTask, submissionText: string): LabScoreBreakdown {
  const trimmed = submissionText.trim();

  let technical = 0;
  let structure = 0;
  let safety = 0;
  let evalRigor = 0;

  const passedChecks: string[] = [];
  const missingHints: string[] = [];

  // Check if user left only the bare starter comments without adding real content
  const strippedComments = trimmed.replace(/<!--[\s\S]*?-->/g, '').trim();
  if (strippedComments.length < 140) {
    return {
      technical: 0,
      structure: 0,
      safety: 0,
      evalRigor: 0,
      total: 0,
      passedChecks: [],
      missingHints: [
        'Your submission is still very short or contains mostly starter template placeholders. Complete the TODO sections or click "Load Exemplar Reference" to study a full 100/100 solution!'
      ],
      verdictTitle: 'Needs Implementation Details',
      encouragementNote: 'Take your time filling out each XML block—your QA instinct for edge cases will shine once you flesh out the rules!'
    };
  }

  for (const check of task.rubricChecks) {
    const allPatternsMatched = check.patterns.every((patternStr) => {
      const regex = new RegExp(patternStr, 'i');
      return regex.test(strippedComments);
    });

    if (allPatternsMatched) {
      passedChecks.push(check.label);
      if (check.dimension === 'technical') technical += check.points;
      if (check.dimension === 'structure') structure += check.points;
      if (check.dimension === 'safety') safety += check.points;
      if (check.dimension === 'evalRigor') evalRigor += check.points;
    } else {
      missingHints.push(check.hintIfMissing);
    }
  }

  // Clamp each dimension to its maximum point cap (30 / 25 / 25 / 20)
  technical = Math.min(30, technical);
  structure = Math.min(25, structure);
  safety = Math.min(25, safety);
  evalRigor = Math.min(20, evalRigor);

  const total = technical + structure + safety + evalRigor;

  let verdictTitle = 'Solid Foundation — Keep Refining!';
  let encouragementNote = 'You are on the right track! Review the specific rubric hints below to push your score above 80/100.';

  if (total >= 95) {
    verdictTitle = 'Principal AI Architect Level (Gold Standard ✨)';
    encouragementNote = 'Phenomenal work! Your prompt structure, deterministic guardrails, and QA evaluation rigor are 100% production-ready.';
  } else if (total >= 80) {
    verdictTitle = 'Senior AI Engineer Ready (Passed with Distinction 🌸)';
    encouragementNote = 'Awesome job! You passed the lab threshold and unlocked this lab milestone. Check out any remaining hints to reach a perfect 100.';
  } else if (total >= 60) {
    verdictTitle = 'Practitioner Draft — Almost at Passing Threshold!';
    encouragementNote = 'Great structure so far! Add the missing safety/evaluation checks highlighted below to cross the 80-point certification bar.';
  }

  return {
    technical,
    structure,
    safety,
    evalRigor,
    total,
    passedChecks,
    missingHints,
    verdictTitle,
    encouragementNote
  };
}

export function buildExternalLlmJudgePrompt(task: PracticalLabTask, submissionText: string): string {
  return `<judge_instruction>
You are a Principal AI Engineering Hiring Manager and Automated Lab Judge.
Evaluate my solution for "${task.title}" against the 100-point rubric below:
1. Technical Accuracy & Architecture (30 pts)
2. Prompt Structure & Determinism (25 pts)
3. Edge-Case, Safety & Hallucination Control (25 pts)
4. QA-to-AI Evaluation Rigor & Observability (20 pts)

Provide:
- My score out of 100 with a breakdown across all 4 dimensions
- Specific strengths of my solution
- Concrete line-by-line improvements to make it 100/100 production-grade
</judge_instruction>

<challenge_scenario>
${task.scenarioBrief}
Requirements:
${task.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}
</challenge_scenario>

<my_submitted_solution>
${submissionText}
</my_submitted_solution>`;
}
