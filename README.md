# Horus Live

[![GitHub Project](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)][1]

[1]: https://github.com/fernandotsda/Grafana-Horus-Live

Horus Live is a streaming plugin for data visualization.

## Query Fields

| Section | Name                         | Description                                                                                                                    |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Fields  | Field                        | JSON Path to get the field value from the response                                                                             |
| Fields  | Type                         | Field value's type (string, boolean, number or time)                                                                           |
| Fields  | Name                         | The field name to be displayed on panel                                                                                        |
| Options | Interval                     | Interval between each request (starts counting after the end of the previous request )                                         |
| Options | Capacity                     | Number of frames that the query can hold                                                                                       |
| Options | Max Fails                    | Maximum number of requests attempts until show error and stop streaming                                                        |
| Options | Group ID                     | Data Group identification, check the 'Explaining Data Group Control' section for more details                                  |
| Options | KeepData                     | Every valid request response is saved internally, and reaplied on the query restart and for all queries of that GroupID        |
| Options | Strict                       | Allows only non empty field's values                                                                                           |
| Options | Fast Start                   | Start in mode 'streaming' instead of 'loading'                                                                                 |
| Options | Unoverridable                | Prevent query from beeing overrided from dashboard variables                                                                   |
| Options | Use Template Name as GroupID | Uses the template name (body section) value as the query Group ID                                                              |
| Path    | 'Method Selection'           | The request METHOD, only support 'GET' or 'PORT'                                                                               |
| Path    | 'Path text area'             | The path complementation for the Data Source's URL                                                                             |
| Params  | 'Params' (Key:Value)         | URL params                                                                                                                     |
| Header  | 'Header' (Key:Value)         | Request Headers                                                                                                                |
| Body    | Horus Template Format        | Uses the horus template body format                                                                                            |
| Body    | Use Time Range as Interval   | Add a field 'INTERVAL' to the request body, containing the current dashboard time range in the format: yyyy-mm-dd : yyyy-mm-dd |
| Body    | 'Raw body text area'         | The request body (JSON syntax)                                                                                                 |
| Body    | Template Name                | The template name, value is used in the body field 'TEMPLATE_NAME'                                                             |
| Body    | Template Type                | The template type, value is used in the body field 'TEMPLATE_TYPE'                                                             |

## Dashboard supported variables

Override all queries (excepted for the unoverridable ones) configuration with the variable value

| Name                         | Query Reference                         | Expected value    |
| ---------------------------- | --------------------------------------- | ----------------- |
| interval                     | Options > Interval                      | Number            |
| capacity                     | Options > Capacity                      | Number            |
| keepData                     | Options > KeepData                      | 'true' or 'false' |
| strict                       | Options > Strict                        | 'true' or 'false' |
| fastStart                    | Options > Fast Start                    | 'true' or 'false' |
| useTemplateNameAsDataGroupId | Options > Use Template Name as Group ID | 'true' or 'false' |
| groupId                      | Options > Group ID                      | Any text          |
| maxFails                     | Options > Max Fails                     | Number            |
| method                       | Path > 'Method Selection'               | 'POST' or 'GET'   |
| urlPath                      | Path > 'Path text area'                 | Any text          |
| body                         | Body > 'Raw body text area'             | JSON string       |
| useHorusTemplateBody         | Body > Horus Template Format            | 'true' or 'false' |
| useTimeRangeAsInterval       | Body > Use Time Range as Interval       | 'true' or 'false' |
| templateName                 | Body > Template Name                    | Any text          |
| templateType                 | Body > Template Type                    | Any text          |

## Explaining Data Group Control

Data Group Control is used to treat multiple queries as a single one when requesting, just by simply setting the same Data Group ID in their query options. This mean that they will share all their request response and they will
only make another request if no other one from other query is pending. Also, when another query is created (or a existing one is restarted), the old data from others queries
will be injected in the query. But be aware that setting two queries that make diferrent types of request (request that have different types of response) in the same Data Group will make things go weird.
