import { CodeEditor, InlineField, InlineFieldRow, InlineSwitch, Input } from '@grafana/ui';
import React from 'react';

interface Props {
  body: string;
  useHorusTemplateBody: boolean;
  useTimeRangeAsInterval: boolean;
  templateName: string;
  templateType: string;
  onBodyChange: (body: string) => void;
  onUseHorusTemplateBodyChange: (use: boolean) => void;
  onUseTimeRangeAsIntervalChange: (use: boolean) => void;
  onTemplateNameChange: (name: string) => void;
  onTemplateTypeChange: (type: string) => void;
  onTemplateBlur: () => void;
}

export const BodyEditor = ({
  body,
  templateName,
  templateType,
  onUseTimeRangeAsIntervalChange,
  onTemplateNameChange,
  onTemplateTypeChange,
  useTimeRangeAsInterval,
  onBodyChange,
  useHorusTemplateBody: useHorusTemplate,
  onUseHorusTemplateBodyChange: onUseHorusTemplateChange,
  onTemplateBlur: onBlur,
}: Props) => {
  return (
    <>
      <InlineFieldRow>
        <InlineSwitch
          marginWidth={2}
          marginHeight={2}
          label="Horus Template Format"
          showLabel={true}
          checked={useHorusTemplate}
          defaultChecked={useHorusTemplate}
          onChange={(e) => onUseHorusTemplateChange(e.currentTarget.checked)}
        ></InlineSwitch>
      </InlineFieldRow>
      {useHorusTemplate === true && (
        <>
          <InlineFieldRow>
            <InlineSwitch
              marginWidth={2}
              label="Use Time Range as Interval"
              showLabel={true}
              checked={useTimeRangeAsInterval}
              defaultChecked={useTimeRangeAsInterval}
              onChange={(e) => onUseTimeRangeAsIntervalChange(e.currentTarget.checked)}
              onBlur={onBlur}
            ></InlineSwitch>
          </InlineFieldRow>
          <InlineFieldRow>
            <InlineField label="Template Name">
              <Input
                value={templateName}
                onChange={(e) => onTemplateNameChange(e.currentTarget.value)}
                onBlur={onBlur}
                width={35}
              />
            </InlineField>
          </InlineFieldRow>
          <InlineFieldRow>
            <InlineField label="Template Type">
              <Input
                value={templateType}
                onChange={(e) => onTemplateTypeChange(e.currentTarget.value)}
                onBlur={onBlur}
                width={35}
              />
            </InlineField>
          </InlineFieldRow>
        </>
      )}
      {useHorusTemplate === false && (
        <InlineFieldRow>
          <CodeEditor
            value={body || ''}
            language={'json'}
            width="800px"
            height="300px"
            showMiniMap={false}
            showLineNumbers={true}
            onBlur={onBodyChange}
          />
        </InlineFieldRow>
      )}
    </>
  );
};
