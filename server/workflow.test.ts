import { describe, it, expect } from "vitest";
import { workflows, productionPhases, workflowCategories } from "../client/src/data/workflows";

describe("Writing Studio Workflows Data", () => {
  it("should have exactly 10 workflows", () => {
    expect(workflows).toHaveLength(10);
  });

  it("should have unique IDs for all workflows", () => {
    const ids = workflows.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have unique numbers 1-10", () => {
    const numbers = workflows.map(w => w.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("should have valid categories for all workflows", () => {
    const validCategories = workflowCategories.map(c => c.id);
    for (const workflow of workflows) {
      expect(validCategories).toContain(workflow.category);
    }
  });

  it("should have required fields for all workflows", () => {
    for (const workflow of workflows) {
      expect(workflow.id).toBeTruthy();
      expect(workflow.title).toBeTruthy();
      expect(workflow.shortTitle).toBeTruthy();
      expect(workflow.description).toBeTruthy();
      expect(workflow.systemPrompt).toBeTruthy();
      expect(workflow.userPromptTemplate).toBeTruthy();
      expect(workflow.inputLabel).toBeTruthy();
      expect(workflow.inputPlaceholder).toBeTruthy();
      expect(workflow.phase).toBeTruthy();
      expect(workflow.number).toBeGreaterThan(0);
      expect(workflow.number).toBeLessThanOrEqual(10);
    }
  });

  it("should have {{INPUT}} placeholder in all userPromptTemplates", () => {
    for (const workflow of workflows) {
      expect(workflow.userPromptTemplate).toContain("{{INPUT}}");
    }
  });

  it("should have system prompts that are substantial (>100 chars)", () => {
    for (const workflow of workflows) {
      expect(workflow.systemPrompt.length).toBeGreaterThan(100);
    }
  });
});

describe("Production Phases", () => {
  it("should have 7 production phases", () => {
    expect(productionPhases).toHaveLength(7);
  });

  it("should cover all 10 workflows across phases", () => {
    const allWorkflowNumbers = productionPhases.flatMap(p => [...p.workflows]);
    expect(allWorkflowNumbers.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("should have phases in correct order", () => {
    const phaseNames = productionPhases.map(p => p.phase);
    expect(phaseNames[0]).toContain("Phase 0");
    expect(phaseNames[6]).toContain("Phase 6");
  });

  it("should not have duplicate workflow numbers across phases", () => {
    const allNumbers = productionPhases.flatMap(p => [...p.workflows]);
    expect(new Set(allNumbers).size).toBe(allNumbers.length);
  });
});

describe("Workflow Categories", () => {
  it("should have 6 categories", () => {
    expect(workflowCategories).toHaveLength(6);
  });

  it("should have unique category IDs", () => {
    const ids = workflowCategories.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should include expected categories", () => {
    const ids = workflowCategories.map(c => c.id);
    expect(ids).toContain("control");
    expect(ids).toContain("architecture");
    expect(ids).toContain("drafting");
    expect(ids).toContain("editing");
    expect(ids).toContain("audit");
    expect(ids).toContain("packaging");
  });
});
