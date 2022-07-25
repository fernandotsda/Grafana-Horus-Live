import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import React from 'react';

interface Props {
  method: string;
  onMethodChange: (method: string) => void;
  path: string;
  onPathChange: (path: string) => void;
  onBlur: () => void
}

export const PathEditor = ({ method, onMethodChange, path, onPathChange, onBlur }: Props) => {
  return (
    <InlineFieldRow>
      <InlineField>
        <Select
          value={method}
          options={[
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
          ]}
          onChange={(v) => onMethodChange(v.value ?? 'GET')}
        />
      </InlineField>
      <InlineField grow>
        <Input placeholder="/orders/${orderId}" spellCheck={false} value={path} onBlur={onBlur} onChange={(e) => onPathChange(e.currentTarget.value)} />
      </InlineField>
    </InlineFieldRow>
  );
};
