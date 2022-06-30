import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React from 'react';
import { HorusDataSourceOptions } from '../types';

type Props = DataSourcePluginOptionsEditorProps<HorusDataSourceOptions>;

/**
 * ConfigEditor lets the user configure connection details like the URL or
 * authentication.
 */
export const ConfigEditor: React.FC<Props> = ({ options, onOptionsChange }) => {
  return (
    <>
    </>
  );
};
