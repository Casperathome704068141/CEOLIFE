import { differenceInCalendarDays } from "date-fns";
import { EventRecord } from "./eventLog";

export type JsonLogic = unknown;

export type RuleAction = {
  ruleId: string;
  action: string;
  params?: Record<string, unknown>;
};

export type RuleDefinition = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  logic: JsonLogic;
  action: RuleAction["action"];
  params?: RuleAction["params"];
};

const ruleRegistry: RuleDefinition[] = [
  {
    id: "rule-bill-notify",
    name: "Alert if utilities unpaid 3d",
    description: "Raises attention when utilities due date is near",
    enabled: true,
    logic: { ">": [{ "var": "bill.daysUntilDue" }, 3] },
    action: "nudge",
    params: { channel: "email" },
  },
  {
    id: "rule-dose-quiet",
    name: "Bypass quiet hours if >20m overdue",
    description: "Escalate overdue medication doses",
    enabled: true,
    logic: { ">": [{ "var": "dose.minutesOverdue" }, 20] },
    action: "nudge",
    params: { channel: "push" },
  },
];

type EvaluationContext = Record<string, unknown>;

type LogicValue =
  | number
  | string
  | boolean
  | null
  | undefined
  | LogicValue[]
  | { [key: string]: LogicValue };

function resolveVar(path: string, data: EvaluationContext) {
  const segments = path.split(".");
  let current: any = data;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }
  return current;
}

function evaluate(expression: LogicValue, data: EvaluationContext): any {
  if (Array.isArray(expression)) {
    return expression.map(item => evaluate(item, data));
  }

  if (expression && typeof expression === "object") {
    const keys = Object.keys(expression as Record<string, unknown>);
    if (keys.length !== 1) {
      const result: Record<string, unknown> = {};
      for (const key of keys) {
        result[key] = evaluate((expression as any)[key], data);
      }
      return result;
    }

    const operator = keys[0];
    const operand = (expression as any)[operator];

    switch (operator) {
      case "var":
        return resolveVar(String(operand), data);
      case "+": {
        const values = evaluate(operand, data);
        return Array.isArray(values)
          ? values.reduce((sum, value) => sum + Number(value || 0), 0)
          : Number(values || 0);
      }
      case "-": {
        const values = evaluate(operand, data);
        if (Array.isArray(values)) {
          const [first, ...rest] = values.map(value => Number(value || 0));
          return rest.reduce((acc, value) => acc - value, first ?? 0);
        }
        return Number(values || 0) * -1;
      }
      case ">": {
        const [left, right] = evaluate(operand, data) as [any, any];
        return Number(left ?? 0) > Number(right ?? 0);
      }
      case "<": {
        const [left, right] = evaluate(operand, data) as [any, any];
        return Number(left ?? 0) < Number(right ?? 0);
      }
      case "and": {
        const values = evaluate(operand, data);
        return Array.isArray(values) ? values.every(Boolean) : Boolean(values);
      }
      case "or": {
        const values = evaluate(operand, data);
        return Array.isArray(values) ? values.some(Boolean) : Boolean(values);
      }
      case "!":
        return !Boolean(evaluate(operand, data));
      case "dueInDays": {
        const dateValue = new Date(String(evaluate(operand, data)));
        return differenceInCalendarDays(dateValue, new Date());
      }
      default:
        return operand;
    }
  }

  return expression;
}

export function evaluateRule(rule: RuleDefinition, context: EvaluationContext): boolean {
  if (!rule.enabled) return false;
  const result = evaluate(rule.logic as LogicValue, context);
  return Boolean(result);
}

export function runRules(context: EvaluationContext): RuleAction[] {
  const actions: RuleAction[] = [];
  for (const rule of ruleRegistry) {
    if (evaluateRule(rule, context)) {
      actions.push({ ruleId: rule.id, action: rule.action, params: rule.params });
    }
  }
  return actions;
}

export function handleEventsWithRules(events: EventRecord[]): RuleAction[] {
  const results: RuleAction[] = [];
  events.forEach(event => {
    const context = {
      event,
      bill: event.payload,
      dose: event.payload,
      goal: event.payload,
    } as EvaluationContext;
    results.push(...runRules(context));
  });
  return results;
}

export function dryRunRule(rule: RuleDefinition, samples: EvaluationContext[]): boolean[] {
  return samples.map(sample => evaluateRule(rule, sample));
}

export function listRules() {
  return ruleRegistry;
}

