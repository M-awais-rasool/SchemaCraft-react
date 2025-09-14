import type { AuthConfig, SchemaField } from "../../../services/schemaService";

export interface EndpointProtection {
  get: boolean;
  post: boolean;
  put: boolean;
  delete: boolean;
}

export interface NotificationConfig {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'relation';

export interface APIDoc {
  info: {
    title: string
    description: string
    version: string
    contact: {
      name: string
      email: string
    }
  }
  host: string
  basePath: string
  schemes: string[]
  api_key: string
  paths: Record<string, any>
  schemas: any[]
}

export interface EndpointMethod {
  summary: string
  description: string
  tags: string[]
  parameters?: any[]
  responses: Record<string, any>
}

export interface AuthConfigurationProps {
  authConfig: AuthConfig | null
  onAuthConfigChange: (config: AuthConfig | null) => void
  fields: SchemaField[]
}