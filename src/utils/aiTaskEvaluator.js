/**
 * Deterministic AI Task Evaluator
 * Safe, synchronous, no side effects
 */
module.exports.evaluateTaskAI = (task) => {
  let riskScore = 0;
  const warnings = [];
  const suggestions = [];

  // Category risk
  const riskyCategories = ["Electrical", "Structural", "Heavy Machinery"];
  task.categories?.forEach((c) => {
    if (riskyCategories.includes(c.name)) {
      riskScore += 20;
      warnings.push(`${c.name} work has safety risks`);
    }
  });

  // Risk flag
  if (task.isRisky) {
    riskScore += 25;
    warnings.push("Task marked as risky");
    suggestions.push("Ensure PPE and safety briefing");
  }

  // Duration risk
  if (task.startDate && task.endDate) {
    const days =
      (new Date(task.endDate) - new Date(task.startDate)) /
      (1000 * 60 * 60 * 24);

    if (days < 2) {
      riskScore += 20;
      warnings.push("Very short task duration");
      suggestions.push("Consider adding buffer time");
    }
  }

  // Worker load risk
  const totalWorkers =
    task.categories?.reduce((sum, c) => sum + c.workersRequired, 0) || 0;

  if (totalWorkers > 15) {
    riskScore += 15;
    warnings.push("High worker concentration");
    suggestions.push("Split work into phases");
  }

  let overdueRisk = "LOW";
  if (riskScore >= 70) overdueRisk = "HIGH";
  else if (riskScore >= 40) overdueRisk = "MEDIUM";

  return {
    riskScore: Math.min(riskScore, 100),
    overdueRisk,
    warnings,
    suggestions,
    lastEvaluatedAt: new Date()
  };
};
