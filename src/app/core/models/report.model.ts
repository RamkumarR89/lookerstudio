import { User } from './user.model';

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  status: ReportStatus;
  visibility: ReportVisibility;
  tags: string[];
  
  // Report configuration
  config: ReportConfig;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  lastViewedAt?: Date;
  
  // Access control
  permissions: ReportPermissions;
  
  // Analytics
  viewCount: number;
  favoriteCount: number;
  
  // Sharing
  shareUrl?: string;
  isPublic: boolean;
  
  // Version control
  version: number;
  isDraft: boolean;
}

export type ReportType = 'dashboard' | 'table' | 'chart' | 'pivot' | 'scorecard' | 'geo' | 'custom';

export type ReportStatus = 'active' | 'inactive' | 'archived' | 'error';

export type ReportVisibility = 'private' | 'shared' | 'public' | 'organization';

export interface ReportConfig {
  // Data source
  dataSource: {
    id: string;
    type: DataSourceType;
    connection: any; // Connection details
  };
  
  // Layout and design
  layout: {
    width: number;
    height: number;
    padding: number;
    backgroundColor?: string;
    backgroundImage?: string;
  };
  
  // Report elements/widgets
  elements: ReportElement[];
  
  // Filters and parameters
  filters: ReportFilter[];
  parameters: ReportParameter[];
  
  // Styling
  theme: {
    colorPalette: string[];
    fontFamily: string;
    fontSize: number;
  };
  
  // Refresh settings
  refreshSettings: {
    autoRefresh: boolean;
    refreshInterval: number; // in minutes
    lastRefreshed?: Date;
  };
}

export interface ReportElement {
  id: string;
  type: ElementType;
  name: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: any; // Element-specific configuration
  dataQuery?: DataQuery;
  style?: ElementStyle;
}

export type ElementType = 'chart' | 'table' | 'text' | 'image' | 'filter' | 'scorecard' | 'map' | 'iframe';

export interface DataQuery {
  fields: string[];
  dimensions: string[];
  metrics: string[];
  filters: QueryFilter[];
  sorts: QuerySort[];
  limit?: number;
  offset?: number;
}

export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type FilterOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 
  'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' |
  'is_null' | 'is_not_null' | 'regex';

export interface QuerySort {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface ElementStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  padding?: number;
  margin?: number;
}

export interface ReportFilter {
  id: string;
  name: string;
  field: string;
  type: FilterType;
  defaultValue?: any;
  options?: FilterOption[];
  isRequired: boolean;
  isVisible: boolean;
}

export type FilterType = 'text' | 'number' | 'date' | 'daterange' | 'dropdown' | 'multiselect' | 'checkbox' | 'radio';

export interface FilterOption {
  label: string;
  value: any;
}

export interface ReportParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  defaultValue: any;
  description?: string;
}

export interface ReportPermissions {
  canView: string[]; // User IDs
  canEdit: string[]; // User IDs
  canShare: string[]; // User IDs
  canDelete: string[]; // User IDs
}

export type DataSourceType = 'mysql' | 'postgresql' | 'mongodb' | 'sqlite' | 'oracle' | 'sqlserver' | 
  'bigquery' | 'redshift' | 'snowflake' | 'csv' | 'json' | 'api' | 'googlesheets' | 'excel';

export interface CreateReportRequest {
  name: string;
  description?: string;
  type: ReportType;
  visibility?: ReportVisibility;
  tags?: string[];
  config: Partial<ReportConfig>;
}

export interface UpdateReportRequest {
  name?: string;
  description?: string;
  tags?: string[];
  config?: Partial<ReportConfig>;
  visibility?: ReportVisibility;
}

export interface ReportListItem {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  visibility: ReportVisibility;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  isFavorite: boolean;
  tags: string[];
}