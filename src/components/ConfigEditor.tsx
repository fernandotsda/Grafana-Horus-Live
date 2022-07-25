import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { isNaN } from 'lodash';
import React, { ChangeEvent } from 'react';
import { HorusDataSourceOptions, Pair } from '../types';
import { KeyValueEditor } from "./KeyValueEditor"

type Props = DataSourcePluginOptionsEditorProps<HorusDataSourceOptions>;

/**
 * ConfigEditor allow configure the default query options. 
 */
export const ConfigEditor: React.FC<Props> = ({ options, onOptionsChange }) => {
  const onCapacityChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Parse capacity
    let capacity = Number(e.currentTarget.value) 

    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        dataHistoryCapacity: capacity,
      },
    });
  };

  const onCapacityBlur = () => {
    let capacity = options.jsonData.dataHistoryCapacity 
    
    // Check if is Nan or less than 1
    if (isNaN(capacity) || capacity <= 1) {
      capacity = 2000 
    }

    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        dataHistoryCapacity: capacity,
      },
    });
  };

  const onDefaultURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        defaultUrl: e.currentTarget.value,
      },
    });
  };

  const onDefaultURLBlur = () => {
    let url = options.jsonData.defaultUrl

    // Check if url ends with one or more '/'
    const removeLastChar = () => {
      if (url.charAt(url.length-1) === '/') {
        url = url.slice(0,-1)
        removeLastChar()
      }
    }
    removeLastChar()

    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        defaultUrl: url,
      },
    });
  }

  const onHeadersChange = (pairs: Array<Pair<string, string>>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        defaultHeaders: pairs,
      },
    });
  };

  return (
    <>
    <h3 className="page-heading">Query settings</h3>
    <InlineFieldRow>
      <InlineField label="Default URL">
        <Input width={60} value={options.jsonData.defaultUrl} 
        placeholder="http://localhost:8080" 
        onChange={onDefaultURLChange} 
        onBlur={onDefaultURLBlur} />
      </InlineField>
    </InlineFieldRow>
      <InlineFieldRow>
        <InlineField label="Data History Capacity" tooltip="Data history capacity of a query group">
          <Input
            width={50}
            value={options.jsonData.dataHistoryCapacity}
            onChange={onCapacityChange}
            spellCheck={false}
            onBlur={onCapacityBlur}
            placeholder="2000"
          />
        </InlineField>
      </InlineFieldRow>
      <KeyValueEditor 
        addRowLabel='Add header' 
        columns={["Name", "Value"]} 
        values={options.jsonData.defaultHeaders ?? []} 
        onBlur={() => {}} 
        onChange={onHeadersChange} />
    </>
  );
};
