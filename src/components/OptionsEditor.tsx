import { css } from '@emotion/css';
import { InlineField, InlineFieldRow, InlineSwitch, Input } from '@grafana/ui';
import React from 'react';

interface Props {
  interval: number;
  onIntervalChange: (interval: number) => void;

  capacity: number;
  onCapacityChange: (interval: number) => void;

  maxFails: number;
  onMaxFailsChange: (maxFails: number) => void;

  groupID: string;
  onGroupIDChange: (groupID: string) => void;

  keepdata: boolean;
  onKeepdataChange: (keepdata: boolean) => void;

  strict: boolean;
  onStrictChange: (keepdata: boolean) => void;

  fastStart: boolean;
  onFastStartChange: (fastStart: boolean) => void;

  unoverridable: boolean;
  onUnoverridableChange: (unoverridable: boolean) => void;

  useTemplateNameAsDataGroupId: boolean;
  onUseTemplateNameAsDataGroupIdChange: (useTemplateNameAsDataGroupId: boolean) => void;

  onCapacityBlur: () => void;
  onMaxFailsBlur: () => void;
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
  maxFails,
  onMaxFailsChange,
  groupID,
  onGroupIDBlur,
  onGroupIDChange,
  strict,
  onStrictChange,
  fastStart,
  onFastStartChange,
  unoverridable,
  onUnoverridableChange,
  useTemplateNameAsDataGroupId,
  onUseTemplateNameAsDataGroupIdChange,
  onCapacityBlur,
  onMaxFailsBlur,
  onIntervalBlur,
}: Props) => {
  return (
    <>
      <InlineFieldRow>
        <InlineField label="Interval" tooltip="Interval between each request (milliseconds).">
          <Input
            width={10}
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
            width={10}
            onBlur={onCapacityBlur}
            placeholder={capacity.toString()}
            value={capacity}
            onChange={(e) => onCapacityChange(Number(e.currentTarget.value))}
          />
        </InlineField>
        <InlineField label="Max Fails" tooltip="Maximum requests fails.">
          <Input
            width={10}
            onBlur={onMaxFailsBlur}
            placeholder={maxFails.toString()}
            value={maxFails}
            onChange={(e) => onMaxFailsChange(Number(e.currentTarget.value))}
          />
        </InlineField>
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
      <InlineFieldRow>
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
          label="Fast Start"
          showLabel={true}
          defaultChecked={fastStart}
          onChange={(e) => onFastStartChange(e.currentTarget.checked)}
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
    </>
  );
};
