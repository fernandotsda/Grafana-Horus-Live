import { TimeRange } from '@grafana/data';
import { CodeEditor, InlineField, InlineFieldRow, RadioButtonGroup } from '@grafana/ui';
import { DataSource } from 'datasource';
import defaults from 'lodash/defaults';
import React, { useState } from 'react';
import { defaultQuery, HorusQuery ,Pair } from '../types';
import { KeyValueEditor } from './KeyValueEditor';
import { PathEditor } from './PathEditor';
import { OptionsEditor } from './OptionsEditor';

interface Props {
  onChange: (query: HorusQuery) => void;
  onRunQuery: () => void;
  editorContext: string;
  query: HorusQuery;
  limitFields?: number;
  datasource: DataSource;
  range?: TimeRange;

  fieldsTab: React.ReactNode;
}

export const TabbedQueryEditor = ({ query, onChange, onRunQuery, fieldsTab }: Props) => {
  const [bodyType, setBodyType] = useState('json');
  const [tabIndex, setTabIndex] = useState(0);

  const q = defaults(query, defaultQuery);

  const onBodyChange = (body: string) => {
    onChange({ ...q, body });
    onRunQuery();
  };

  const onParamsChange = (params: Array<Pair<string, string>>) => {
    onChange({ ...q, params });
    onRunQuery();
  };

  const onIntervalChange = (interval: number) => {
    // Check if is NaN
    if (isNaN(interval)) {return;} 

    onChange({ ...q, interval });
  };

  const onCapacityChange = (capacity: number) => {
    // Check if is NaN
    if (isNaN(capacity)) {return;} 

    onChange({ ...q, capacity: capacity });
  };

  const onKeepdataChange = (keepdata: boolean) => {
    onChange({ ...q, keepdata });
    onRunQuery();
  };

  const onSkipperChange = (skipper: boolean) => {
    onChange({ ...q, skipper: skipper });
    onRunQuery();
  };

  const onHeadersChange = (headers: Array<Pair<string, string>>) => {
    onChange({ ...q, headers });
    onRunQuery();
  };

  const onCapacityBlur = () => {
    if (q.capacity < 1) {
      q.capacity = 1
    } 
    onRunQuery()
  }

  const onIntervalBlur = () => {
    if (q.interval < 200) {
      q.interval = 200
    } 
    onRunQuery()
  }

  const tabs = [
    {
      title: 'Fields',
      content: fieldsTab,
    },
    {
      title: 'Options',
      content: (<OptionsEditor 
      capacity={q.capacity}
      onCapacityChange={onCapacityChange}
      interval={q.interval}
      onIntervalChange={onIntervalChange} 
      keepdata={q.keepdata}
      onKeepdataChange={onKeepdataChange}
      skipper={q.skipper}
      onSkipperChange={onSkipperChange}
      onCapacityBlur={onCapacityBlur}
      onIntervalBlur={onIntervalBlur}
      />)
    },
    {
      title: 'Path',
      content: (
        <PathEditor
          method={q.method ?? 'GET'}
          onBlur={() => {
            onRunQuery()
          }}
          onMethodChange={(method) => {
            onChange({ ...q, method });
            onRunQuery();
          }}
          path={q.urlPath ?? ''}
          onPathChange={(path) => {
            onChange({ ...q, urlPath: path });
          }}
        />
      ),
    },
    {
      title: 'Params',
      content: (
        <KeyValueEditor
          addRowLabel={'Add param'}
          columns={['Key', 'Value']}
          values={q.params ?? []}
          onChange={onParamsChange}
          onBlur={() => onRunQuery()}
        />
      ),
    },
    {
      title: 'Headers',
      content: (
        <KeyValueEditor
          addRowLabel={'Add header'}
          columns={['Key', 'Value']}
          values={q.headers ?? []}
          onChange={onHeadersChange}
          onBlur={() => onRunQuery()}
        />
      ),
    },
    {
      title: 'Body',
      content: (
        <>
          <InlineFieldRow>
            <InlineField label="Syntax highlighting">
              <RadioButtonGroup
                value={bodyType}
                onChange={(v) => setBodyType(v ?? 'json')}
                options={[
                  { label: 'Text', value: 'plaintext' },
                  { label: 'JSON', value: 'json' },
                  { label: 'XML', value: 'xml' },
                ]}
              />
            </InlineField>
          </InlineFieldRow>
          <InlineFieldRow>
            <CodeEditor
                value={q.body || ''}
                language={bodyType}
                width="800px"
                height="300px"
                showMiniMap={false}
                showLineNumbers={true}
                onBlur={onBodyChange}
            />
          </InlineFieldRow>
        </>
      ),
    },
  ];

  return (
    <>
      <InlineFieldRow>
        <InlineField>
          <RadioButtonGroup
            onChange={(e) => setTabIndex(e ?? 0)}
            value={tabIndex}

            options={tabs.map((tab, idx) => ({ label: tab.title, value: idx }))}
          />
        </InlineField>
      </InlineFieldRow>
      {tabs[tabIndex].content}
    </>
  );
};
