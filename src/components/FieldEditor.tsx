import { FieldType, SelectableValue } from '@grafana/data';
import { Icon, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import React from 'react';
import { JsonField } from 'types';
import { JsonPathQueryField } from './JsonPathQueryField';

interface Props {
  limit?: number;
  onChange: (value: JsonField[]) => void;
  value: JsonField[];
  onBlur: () => void
}

export const FieldEditor = ({ value = [], onChange, limit, onBlur }: Props) => {
  const onChangePath = (i: number) => (e: string) => {
    onChange(value.map((field, n) => (i === n ? { ...value[i], jsonPath: e } : field)));
  };
 
  const onNameChange = (i: number) => (e: any) => {
    onChange(value.map((field, n) => (i === n ? { ...value[i], name: e.currentTarget.value } : field)));
  };

  const onChangeType = (i: number) => (e: SelectableValue<string>) => {
    onChange(
      value.map((field, n) =>
        i === n ? { ...value[i], type: (e.value === 'auto' ? undefined : e.value) as FieldType } : field
      )
    );
  };

  const addField = (i: number) => () => {
    if (!limit || value.length < limit) {
      onChange([...value.slice(0, i + 1), { name: '', jsonPath: '' }, ...value.slice(i + 1)]);
    }
  };
  const removeField = (i: number) => () => {
    onChange([...value.slice(0, i), ...value.slice(i + 1)]);
  };

  return (
    <>
      {value.map((field, index) => (
        <InlineFieldRow key={index}>
          <InlineField
            label="Field"
            tooltip={
              <div>
                A <a href="https://goessner.net/articles/JsonPath/">JSON Path</a> query that selects one or more values
                from a JSON object. The first value founded will be used.
              </div>
            }
            grow
          >
            <JsonPathQueryField
              onBlur={onBlur}
              onChange={onChangePath(index)}
              query={field.jsonPath}
            />
          </InlineField>
          <InlineField label="Type">
            <Select
              onBlur={onBlur}
              value={field.type ?? 'string'}
              width={12}
              onChange={onChangeType(index)}
              options={[
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Time', value: 'time' },
                { label: 'Boolean', value: 'boolean' },
              ]}
            />
          </InlineField>
          <InlineField label="Name">
            <Input width={12} value={field.name} onBlur={onBlur} onChange={onNameChange(index)} />
          </InlineField>

          {(!limit || value.length < limit) && (
            <a className="gf-form-label" onClick={addField(index)}>
              <Icon name="plus" />
            </a>
          )}

          {value.length > 1 ? (
            <a className="gf-form-label" onClick={removeField(index)}>
              <Icon name="minus" />
            </a>
          ) : null}
        </InlineFieldRow>
      ))}
    </>
  );
};
