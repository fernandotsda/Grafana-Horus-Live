import { css } from '@emotion/css';
import { InlineField, InlineFieldRow, InlineSwitch, Input } from '@grafana/ui';
import React from 'react';

interface Props {
  interval: number;
  onIntervalChange: (interval: number) => void;

  capacity: number;
  onCapacityChange: (interval: number) => void;

  keepdata: boolean
  onKeepdataChange: (keepdata: boolean) => void;

  skipper: boolean
  onSkipperChange: (keepdata: boolean) => void;

  onCapacityBlur: () => void
  onIntervalBlur: () => void
}

export const OptionsEditor = ({ interval, onIntervalChange, keepdata, onKeepdataChange, capacity, onCapacityChange, skipper, onSkipperChange, onCapacityBlur, onIntervalBlur}: Props) => {
  return (
    <InlineFieldRow>
      <InlineField  label="Interval" tooltip="Interval between each request (miliseconds).">
      <Input onBlur={onIntervalBlur} placeholder={interval.toString()} value={interval} onChange={(e) => onIntervalChange(Number(e.currentTarget.value))} />
      </InlineField>
      <InlineField label="Capacity" tooltip="Maximum numbers of frames the query can hold. If keep data is enabled, the data persists on query refresh.">
      <Input onBlur={onCapacityBlur} placeholder={capacity.toString()} value={capacity} onChange={(e) => onCapacityChange(Number(e.currentTarget.value))} />
      </InlineField>
      <InlineSwitch marginWidth={2} label="Keep Data" showLabel={true} defaultChecked={keepdata
      } onChange={(e) => onKeepdataChange(e.currentTarget.checked)}>
      </InlineSwitch>
      <InlineSwitch className={css`margin-left:4px`} label="Skipper" showLabel={true} defaultChecked={skipper
      } onChange={(e) => onSkipperChange(e.currentTarget.checked)}>
      </InlineSwitch>
    </InlineFieldRow>
  );
};
