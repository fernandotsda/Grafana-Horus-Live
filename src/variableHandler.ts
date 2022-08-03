import { getTemplateSrv } from '@grafana/runtime';
import { HorusQuery } from './types';

/**
 * Override almost every query field
 * if setted on dashboard variables with an valid value
 * @param query The query
 * @returns void
 */
export function OverrideQueryWithVariables(query: HorusQuery): void {
  const variables = getTemplateSrv().getVariables();
  variables.forEach((v) => {
    // Get variable name which will be used as query key
    const variableAsKey = v.name;

    // Check if key exist in query
    if (variableAsKey in query) {
      // Transform to type any
      const queryAsAny: any = query as any;

      // Get raw value selected
      let rawValue = '';
      (v as any)['options']?.forEach((opt: any) => {
        if (!opt) {
          return;
        }
        if (opt['selected']) {
          rawValue = opt['value'] ?? '';
        }
      });

      // Get field type
      const fieldType: string = typeof queryAsAny[variableAsKey];

      if (fieldType === 'string') {
        queryAsAny[variableAsKey] = rawValue;
      } else if (fieldType === 'boolean') {
        // Parse to boolean
        if (rawValue === 'true') {
          queryAsAny[variableAsKey] = true;
        } else if (rawValue === 'false') {
          queryAsAny[variableAsKey] = false;
        } /*Invalid value*/ else {
          throw new Error(
            `Invalid variable (${variableAsKey}) value, received: ${rawValue}, expected: "true" or "false"`
          );
        }
      } else if (fieldType === 'number') {
        // Parse to number
        const valueAsNumber = Number(rawValue);

        // Validate value
        if (isNaN(valueAsNumber)) {
          throw new Error(
            `Invalid variable (${variableAsKey}) value, received: ${rawValue}, expected: value typeof number`
          );
        }
        queryAsAny[variableAsKey] = valueAsNumber;
      } else {
        // Throw error if field is unsupported
        throw new Error(`Unsupported variable override: ${variableAsKey}`);
      }
    } else {
      // Throw error if key doesn't exist in query
      throw new Error(`Unknown variable: ${variableAsKey}`);
    }
  });
}
