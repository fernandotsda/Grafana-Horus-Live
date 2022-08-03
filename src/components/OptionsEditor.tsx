import { css } from '@emotion/css';
import { InlineField, InlineFieldRow, InlineSwitch, Input } from '@grafana/ui';
import React from 'react';

interface Props {
  interval: number;
  onIntervalChange: (interval: number) => void;

  capacity: number;
  onCapacityChange: (interval: number) => void;

  groupID: string;
  onGroupIDChange: (groupID: string) => void;

  keepdata: boolean;
  onKeepdataChange: (keepdata: boolean) => void;

  strict: boolean;
  onStrictChange: (keepdata: boolean) => void;

  unoverridable: boolean;
  onUnoverridableChange: (unoverridable: boolean) => void;

  useTemplateNameAsDataGroupId: boolean;
  onUseTemplateNameAsDataGroupIdChange: (useTemplateNameAsDataGroupId: boolean) => void;

  onCapacityBlur: () => void;
  onIntervalBlur: () => void;
  onGroupIDBlur: () => void;
}

export const OptionsEditor = ({
  interval,
  onIntervalChange,
  keepdata,
  onKeepdataChange,
  capacity,
  onCapacityChange,
  groupID,
  onGroupIDBlur,
  onGroupIDChange,
  strict,
  onStrictChange,
  unoverridable,
  onUnoverridableChange,
  useTemplateNameAsDataGroupId,
  onUseTemplateNameAsDataGroupIdChange,
  onCapacityBlur,
  onIntervalBlur,
}: Props) => {
  return (
    <>
      <InlineFieldRow>
        <InlineField label="Interval" tooltip="Interval between each request (milliseconds).">
          <Input
            onBlur={onIntervalBlur}
            placeholder={interval.toString()}
            value={interval}
            onChange={(e) => onIntervalChange(Number(e.currentTarget.value))}
          />
        </InlineField>
        <InlineField
          label="Capacity"
          tooltip="Maximum numbers of frames the query can hold. If keep data is enabled, the data persists on query refresh."
        >
          <Input
            onBlur={onCapacityBlur}
            placeholder={capacity.toString()}
            value={capacity}
            onChange={(e) => onCapacityChange(Number(e.currentTarget.value))}
          />
        </InlineField>
        <InlineSwitch
          marginWidth={2}
          label="Keep Data"
          showLabel={true}
          defaultChecked={keepdata}
          onChange={(e) => onKeepdataChange(e.currentTarget.checked)}
        ></InlineSwitch>
        <InlineSwitch
          className={css`
            margin-left: 4px;
          `}
          label="Strict"
          showLabel={true}
          defaultChecked={strict}
          onChange={(e) => onStrictChange(e.currentTarget.checked)}
        ></InlineSwitch>
        <InlineSwitch
          className={css`
            margin-left: 4px;
          `}
          label="Unoverridable"
          showLabel={true}
          defaultChecked={unoverridable}
          onChange={(e) => onUnoverridableChange(e.currentTarget.checked)}
        ></InlineSwitch>
        <InlineSwitch
          className={css`
            margin-left: 4px;
          `}
          label="Use Template Name as DataGroupId"
          showLabel={true}
          defaultChecked={useTemplateNameAsDataGroupId}
          onChange={(e) => onUseTemplateNameAsDataGroupIdChange(e.currentTarget.checked)}
        ></InlineSwitch>
      </InlineFieldRow>
      <InlineFieldRow>
        <InlineField disabled={!keepdata || useTemplateNameAsDataGroupId} label="Group ID">
          <Input
            width={30}
            onBlur={onGroupIDBlur}
            placeholder={groupID}
            value={groupID}
            onChange={(e) => onGroupIDChange(e.currentTarget.value)}
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
};
