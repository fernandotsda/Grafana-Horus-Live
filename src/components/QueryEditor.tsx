import { FieldType, QueryEditorProps } from '@grafana/data';
import { DataSource } from 'datasource';
import React from 'react';
import { HorusDataSourceOptions, HorusQuery } from '../types';
import { FieldEditor } from './FieldEditor';
import { TabbedQueryEditor } from './TabbedQueryEditor';

interface Props extends QueryEditorProps<DataSource, HorusQuery, HorusDataSourceOptions> {
  limitFields?: number;
  editorContext?: string;
}

export const QueryEditor: React.FC<Props> = (props) => {
  const { query, editorContext, onChange, onRunQuery } = props;
  
  // Add field if missing
  if(!query.fields) {
    query.fields = [{ jsonPath: '', type: FieldType.string }]
  }

  return (
    <TabbedQueryEditor
      {...props}
      editorContext={editorContext || 'default'}
      fieldsTab={
        <FieldEditor
          value={query.fields}
          onBlur={() => {
            onRunQuery()
          }}
          onChange={(value) => {
            onChange({ ...query, fields: value });
          }}
          limit={props.limitFields}
        />
      }
    />
  );
};
