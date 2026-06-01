/**
 * Sprint Manager - Manages sprint-wise test execution
 *
 * Features:
 * - Map Jira tickets to sprints
 * - Filter tests by sprint
 * - Generate sprint-based reports
 * - Support all-sprint testing
 */

import * as fs from 'fs';
import * as path from 'path';

export interface SprintConfig {
  sprints: Record<string, Sprint>;
  testTypes: Record<string, TestType>;
  environments: Record<string, string>;
}

export interface Sprint {
  name: string;
  startDate: string;
  endDate: string;
  tickets: string[];
}

export interface TestType {
  tag: string;
  description: string;
  purpose: string;
}

export class SprintManager {
  private config: SprintConfig;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || path.join(process.cwd(), 'sprint-config.json');

    if (!fs.existsSync(this.configPath)) {
      throw new Error(`Sprint config not found at: ${this.configPath}`);
    }

    const configContent = fs.readFileSync(this.configPath, 'utf-8');
    this.config = JSON.parse(configContent);
  }

  /**
   * Get all sprints
   */
  getSprints(): Record<string, Sprint> {
    return this.config.sprints;
  }

  /**
   * Get specific sprint by key
   */
  getSprint(sprintKey: string): Sprint | null {
    return this.config.sprints[sprintKey] || null;
  }

  /**
   * Get sprint by number (1-16)
   */
  getSprintByNumber(number: number): Sprint | null {
    const sprintKey = `sprint-${number}`;
    return this.getSprint(sprintKey);
  }

  /**
   * Get all tickets in a sprint
   */
  getSprintTickets(sprintKey: string): string[] {
    const sprint = this.getSprint(sprintKey);
    return sprint ? sprint.tickets : [];
  }

  /**
   * Get all tickets across all sprints
   */
  getAllTickets(): string[] {
    const allTickets: string[] = [];
    Object.values(this.config.sprints).forEach(sprint => {
      allTickets.push(...sprint.tickets);
    });
    return allTickets;
  }

  /**
   * Get grep pattern for specific sprint
   */
  getSprintGrepPattern(sprintKey: string): string {
    const tickets = this.getSprintTickets(sprintKey);
    if (tickets.length === 0) {
      return '';
    }
    return `(${tickets.join('|')})`;
  }

  /**
   * Get grep pattern for all sprints
   */
  getAllSprintsGrepPattern(): string {
    const allTickets = this.getAllTickets();
    return `(${allTickets.join('|')})`;
  }

  /**
   * Get test type tag
   */
  getTestTypeTag(testType: string): string {
    const type = this.config.testTypes[testType];
    return type ? type.tag : '';
  }

  /**
   * Build complete grep pattern (sprint + test type)
   */
  buildGrepPattern(sprintKey: string, testType: string): string {
    const sprintPattern = sprintKey === 'all'
      ? this.getAllSprintsGrepPattern()
      : this.getSprintGrepPattern(sprintKey);

    const testTag = this.getTestTypeTag(testType);

    if (!testTag) {
      return sprintPattern;
    }

    return `${sprintPattern} AND ${testTag}`;
  }

  /**
   * Get sprint info for display
   */
  getSprintInfo(sprintKey: string): { name: string; tickets: string[] } {
    if (sprintKey === 'all') {
      return {
        name: 'All Sprints (1-16)',
        tickets: this.getAllTickets()
      };
    }

    const sprint = this.getSprint(sprintKey);
    if (!sprint) {
      throw new Error(`Sprint not found: ${sprintKey}`);
    }

    return {
      name: sprint.name,
      tickets: sprint.tickets
    };
  }

  /**
   * Get all test types
   */
  getTestTypes(): Record<string, TestType> {
    return this.config.testTypes;
  }

  /**
   * Get all environments
   */
  getEnvironments(): Record<string, string> {
    return this.config.environments;
  }

  /**
   * Validate sprint exists
   */
  validateSprint(sprintKey: string): boolean {
    return sprintKey === 'all' || !!this.getSprint(sprintKey);
  }

  /**
   * Validate test type exists
   */
  validateTestType(testType: string): boolean {
    return !!this.config.testTypes[testType];
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): SprintConfig {
    return this.config;
  }

  /**
   * Get sprint statistics
   */
  getSprintStats(sprintKey: string): { name: string; ticketCount: number; percentage: number } {
    const sprint = this.getSprint(sprintKey);
    if (!sprint) {
      throw new Error(`Sprint not found: ${sprintKey}`);
    }

    const allTickets = this.getAllTickets();
    const percentage = (sprint.tickets.length / allTickets.length) * 100;

    return {
      name: sprint.name,
      ticketCount: sprint.tickets.length,
      percentage: Math.round(percentage * 10) / 10
    };
  }

  /**
   * List all sprints with statistics
   */
  listAllSprints(): Array<{ key: string; name: string; ticketCount: number }> {
    return Object.entries(this.config.sprints).map(([key, sprint]) => ({
      key,
      name: sprint.name,
      ticketCount: sprint.tickets.length
    }));
  }

  /**
   * Find sprint by ticket
   */
  findSprintByTicket(ticket: string): { key: string; sprint: Sprint } | null {
    for (const [key, sprint] of Object.entries(this.config.sprints)) {
      if (sprint.tickets.includes(ticket)) {
        return { key, sprint };
      }
    }
    return null;
  }

  /**
   * Get tickets for multiple sprints
   */
  getTicketsForSprints(sprintKeys: string[]): string[] {
    const tickets: string[] = [];
    sprintKeys.forEach(key => {
      const sprintTickets = this.getSprintTickets(key);
      tickets.push(...sprintTickets);
    });
    return [...new Set(tickets)]; // Remove duplicates
  }
}

/**
 * Global instance
 */
let sprintManagerInstance: SprintManager | null = null;

/**
 * Get or create sprint manager instance
 */
export function getSprintManager(): SprintManager {
  if (!sprintManagerInstance) {
    sprintManagerInstance = new SprintManager();
  }
  return sprintManagerInstance;
}

/**
 * Reset sprint manager (for testing)
 */
export function resetSprintManager(): void {
  sprintManagerInstance = null;
}
