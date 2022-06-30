import { BracesPlugin, QueryField, SlatePrism,  } from '@grafana/ui';
import React from 'react';

interface Props {
  query: string;
  onBlur: () => void;
  onChange: (v: string) => void;
}

/**
 * JsonPathQueryField is an editor for JSON Path.
 */
export const JsonPathQueryField: React.FC<Props> = ({ query, onBlur, onChange }) => {
  /**
   * The QueryField supports Slate plugins, so let's add a few useful ones.
   */
  const plugins = [
    BracesPlugin(),
    SlatePrism({
      onlyIn: (node: any) => node.type === 'code_block',
      getSyntax: () => 'js',
    }),
  ];

  const cleanText = (s: string) => s.replace(/[{}[\]="(),!~+\-*/^%\|\$@\.]/g, '').trim();

  return (
    <QueryField
      additionalPlugins={plugins}
      query={query}
      cleanText={cleanText}
      onRunQuery={onBlur}
      onChange={onChange}
      portalOrigin="jsonapi"
      placeholder="$.items[*].name"
    />
  );
};
