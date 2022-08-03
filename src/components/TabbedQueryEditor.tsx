import { TimeRange } from '@grafana/data';
import { InlineField, InlineFieldRow, RadioButtonGroup } from '@grafana/ui';
import { DataSource } from 'datasource';
import defaults from 'lodash/defaults';
import React, { useState } from 'react';
import { defaultQuery, HorusQuery, Pair } from '../types';
import { KeyValueEditor } from './KeyValueEditor';
import { PathEditor } from './PathEditor';
import { OptionsEditor } from './OptionsEditor';
import shortUUID from 'short-uuid';
import { BodyEditor } from './BodyEditor';

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
    if (isNaN(interval)) {
      return;
    }

    onChange({ ...q, interval });
  };

  const onCapacityChange = (capacity: number) => {
    // Check if is NaN
    if (isNaN(capacity)) {
      return;
    }

    onChange({ ...q, capacity: capacity });
  };

  const onGroupIDChange = (groupID: string) => {
    onChange({ ...q, dataGroupId: groupID });
  };

  const onKeepdataChange = (keepdata: boolean) => {
    let groupID: string = q.dataGroupId;
    if (!keepdata) {
      groupID = '';
    } else if (q.dataGroupId.length === 0) {
      groupID = shortUUID.generate();
    }
    onChange({ ...q, keepdata, dataGroupId: groupID });
    onRunQuery();
  };

  const onStrictChange = (strict: boolean) => {
    onChange({ ...q, strict: strict });
    onRunQuery();
  };

  const onUnoverridableChange = (unoverridable: boolean) => {
    onChange({ ...q, unoverridable: unoverridable });
    onRunQuery();
  };

  const onUseTemplateNameAsDataGroupIdChange = (useTemplateNameAsDataGroupId: boolean) => {
    onChange({ ...q, useTemplateNameAsDataGroupId: useTemplateNameAsDataGroupId });
    onRunQuery();
  };

  const onHeadersChange = (headers: Array<Pair<string, string>>) => {
    onChange({ ...q, headers });
    onRunQuery();
  };

  const onCapacityBlur = () => {
    if (q.capacity < 1) {
      q.capacity = 1;
    }
    onRunQuery();
  };

  const onGroupIDBlur = () => {
    onRunQuery();
  };

  const onIntervalBlur = () => {
    if (q.interval < 200) {
      q.interval = 200;
    }
    onRunQuery();
  };

  const onTemplateNameChange = (name: string) => {
    onChange({
      ...q,
      templateName: name,
    });
  };

  const onTemplateTypeChange = (type: string) => {
    onChange({ ...q, templateType: type });
  };

  const onUseTimeRangeAsIntervalChange = (use: boolean) => {
    onChange({ ...q, useTimeRangeAsInterval: use });
    onRunQuery();
  };

  const onTemplateBlur = (): void => {
    onRunQuery();
  };

  const tabs = [
    {
      title: 'Fields',
      content: fieldsTab,
    },
    {
      title: 'Options',
      content: (
        <OptionsEditor
          groupID={q.dataGroupId}
          onGroupIDBlur={onGroupIDBlur}
          onGroupIDChange={onGroupIDChange}
          capacity={q.capacity}
          onCapacityChange={onCapacityChange}
          interval={q.interval}
          onIntervalChange={onIntervalChange}
          keepdata={q.keepdata}
          onKeepdataChange={onKeepdataChange}
          strict={q.strict}
          onStrictChange={onStrictChange}
          useTemplateNameAsDataGroupId={q.useTemplateNameAsDataGroupId}
          onUseTemplateNameAsDataGroupIdChange={onUseTemplateNameAsDataGroupIdChange}
          unoverridable={q.unoverridable}
          onUnoverridableChange={onUnoverridableChange}
          onCapacityBlur={onCapacityBlur}
          onIntervalBlur={onIntervalBlur}
        />
      ),
    },
    {
      title: 'Path',
      content: (
        <PathEditor
          method={q.method ?? 'GET'}
          onBlur={() => {
            onRunQuery();
          }}
          onMethodChange={(method) => {
            onChange({ ...q, method });
            onRunQuery();
          }}
          path={q.urlPath ?? ''}
          onPathChange={(path) => {
            if (path.length > 0 && path[0] !== '/') {
              path = '/' + path;
            }
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
        <BodyEditor
          body={q.body}
          templateName={q.templateName}
          templateType={q.templateType}
          useHorusTemplateBody={query.useHorusTemplateBody}
          useTimeRangeAsInterval={q.useTimeRangeAsInterval}
          onBodyChange={onBodyChange}
          onUseHorusTemplateBodyChange={(use: boolean) => onChange({ ...q, useHorusTemplateBody: use })}
          onTemplateNameChange={onTemplateNameChange}
          onTemplateTypeChange={onTemplateTypeChange}
          onUseTimeRangeAsIntervalChange={onUseTimeRangeAsIntervalChange}
          onTemplateBlur={() => onTemplateBlur()}
        />
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
