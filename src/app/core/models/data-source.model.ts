export interface DataSource {
  id: string;
  name: string;
  description?: string;
  type: DataSourceType;
  connectionConfig: DataSourceConnection;
  
  // Schema information
  schema?: DataSourceSchema;
  
  // Status and health
  status: DataSourceStatus;
  lastConnected?: Date;
  lastError?: string;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Access control
  isShared: boolean;
  permissions: DataSourcePermissions;
  
  // Usage statistics
  usageCount: number;
  lastUsed?: Date;
}

export type DataSourceType = 
  // Relational databases
  | 'mysql'
  | 'postgresql' 
  | 'sqlite'
  | 'oracle'
  | 'sqlserver'
  | 'mariadb'
  
  // NoSQL databases
  | 'mongodb'
  | 'elasticsearch'
  | 'redis'
  
  // Cloud data warehouses
  | 'bigquery'
  | 'redshift'
  | 'snowflake'
  | 'databricks'
  
  // File-based
  | 'csv'
  | 'json'
  | 'parquet'
  | 'excel'
  
  // SaaS and APIs
  | 'googlesheets'
  | 'airtable'
  | 'salesforce'
  | 'hubspot'
  | 'stripe'
  | 'shopify'
  | 'api'
  
  // Real-time
  | 'kafka'
  | 'rabbitmq'
  | 'websocket';

export type DataSourceStatus = 'connected' | 'disconnected' | 'error' | 'testing' | 'inactive';

export interface DataSourceConnection {
  // Common connection properties
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string; // Should be encrypted
  
  // SSL/TLS settings
  ssl?: {
    enabled: boolean;
    ca?: string;
    cert?: string;
    key?: string;
    rejectUnauthorized?: boolean;
  };
  
  // Connection pool settings
  pool?: {
    min: number;
    max: number;
    acquireTimeoutMillis: number;
    idleTimeoutMillis: number;
  };
  
  // Type-specific configurations
  mongoConfig?: {
    authSource?: string;
    replicaSet?: string;
    readPreference?: string;
  };
  
  apiConfig?: {
    baseUrl: string;
    apiKey?: string;
    headers?: Record<string, string>;
    authentication?: ApiAuthentication;
  };
  
  fileConfig?: {
    filePath?: string;
    delimiter?: string;
    encoding?: string;
    hasHeader?: boolean;
    sheetName?: string; // For Excel files
  };
  
  cloudConfig?: {
    region?: string;
    projectId?: string;
    keyFile?: string;
    credentials?: any;
  };
}

export interface ApiAuthentication {
  type: 'none' | 'basic' | 'bearer' | 'oauth2' | 'apikey';
  credentials?: {
    username?: string;
    password?: string;
    token?: string;
    clientId?: string;
    clientSecret?: string;
    scope?: string;
    authUrl?: string;
    tokenUrl?: string;
  };
}

export interface DataSourceSchema {
  tables: DataTable[];
  relationships?: DataRelationship[];
  lastUpdated: Date;
}

export interface DataTable {
  name: string;
  schema?: string;
  displayName?: string;
  description?: string;
  columns: DataColumn[];
  primaryKey?: string[];
  rowCount?: number;
  lastUpdated?: Date;
}

export interface DataColumn {
  name: string;
  displayName?: string;
  type: DataType;
  nullable: boolean;
  defaultValue?: any;
  description?: string;
  
  // Statistics for better insights
  statistics?: ColumnStatistics;
  
  // Categorization
  category?: ColumnCategory;
  tags?: string[];
}

export type DataType = 
  | 'string' | 'text' | 'varchar' | 'char'
  | 'integer' | 'bigint' | 'smallint' | 'tinyint'
  | 'decimal' | 'numeric' | 'float' | 'double'
  | 'boolean' | 'bit'
  | 'date' | 'datetime' | 'timestamp' | 'time'
  | 'json' | 'jsonb' | 'xml'
  | 'binary' | 'blob' | 'uuid'
  | 'array' | 'object';

export interface ColumnStatistics {
  distinctCount?: number;
  nullCount?: number;
  minValue?: any;
  maxValue?: any;
  avgValue?: number;
  topValues?: Array<{ value: any; count: number }>;
}

export type ColumnCategory = 'dimension' | 'metric' | 'date' | 'geo' | 'identifier' | 'other';

export interface DataRelationship {
  name: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface DataSourcePermissions {
  canView: string[]; // User IDs
  canEdit: string[]; // User IDs
  canDelete: string[]; // User IDs
  canUse: string[]; // User IDs who can use this data source in reports
}

export interface CreateDataSourceRequest {
  name: string;
  description?: string;
  type: DataSourceType;
  connectionConfig: DataSourceConnection;
  isShared?: boolean;
}

export interface UpdateDataSourceRequest {
  name?: string;
  description?: string;
  connectionConfig?: Partial<DataSourceConnection>;
  isShared?: boolean;
}

export interface TestConnectionRequest {
  type: DataSourceType;
  connectionConfig: DataSourceConnection;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  responseTime?: number;
  schema?: DataSourceSchema;
}

export interface QueryRequest {
  dataSourceId: string;
  query: string;
  parameters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface QueryResponse {
  success: boolean;
  data: any[];
  columns: Array<{
    name: string;
    type: DataType;
  }>;
  totalRows?: number;
  executionTime: number;
  error?: string;
}