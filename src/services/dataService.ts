import api from './api';

export interface DataRecord {
  id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class DataService {
  // Get user's API key for dynamic API access
  static getUserAPIKey(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.api_key;
    }
    return null;
  }

  // Create API instance with API key
  static getAPIInstance() {
    const apiKey = this.getUserAPIKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const apiInstance = api.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://www.schemacraft.it.com/',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    return apiInstance;
  }

  // Process relation fields to ensure proper format
  static processRelationFields(data: Record<string, any>): Record<string, any> {
    const processedData = { ...data };
    
    // Convert relation field values to ObjectID format if they're strings
    for (const [key, value] of Object.entries(processedData)) {
      if (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
        // If it looks like an ObjectID, keep it as string (backend will handle conversion)
        processedData[key] = value;
      }
    }
    
    return processedData;
  }

  static async createDocument(collection: string, data: Record<string, any>): Promise<DataRecord> {
    const apiInstance = this.getAPIInstance();
    
    // Convert relation field values to proper format if needed
    const processedData = this.processRelationFields(data);
    
    const response = await apiInstance.post<DataRecord>(`/api/${collection}`, processedData);
    return response.data;
  }

  static async getDocuments(
    collection: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<DataRecord>> {
    const apiInstance = this.getAPIInstance();
    const response = await apiInstance.get<PaginatedResponse<DataRecord>>(
      `/api/${collection}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  static async getDocumentById(collection: string, id: string): Promise<DataRecord> {
    const apiInstance = this.getAPIInstance();
    const response = await apiInstance.get<DataRecord>(`/api/${collection}/${id}`);
    return response.data;
  }

  static async updateDocument(
    collection: string,
    id: string,
    data: Record<string, any>
  ): Promise<DataRecord> {
    const apiInstance = this.getAPIInstance();
    
    // Convert relation field values to proper format if needed
    const processedData = this.processRelationFields(data);
    
    const response = await apiInstance.put<DataRecord>(`/api/${collection}/${id}`, processedData);
    return response.data;
  }

  static async deleteDocument(collection: string, id: string): Promise<{ message: string }> {
    const apiInstance = this.getAPIInstance();
    const response = await apiInstance.delete<{ message: string }>(`/api/${collection}/${id}`);
    return response.data;
  }

  // Get documents for relation field dropdowns
  static async getDocumentsForRelation(collection: string): Promise<{ id: string; label: string }[]> {
    try {
      const response = await this.getDocuments(collection, 1, 100); // Get first 100 for dropdown
      return response.data.map(doc => ({
        id: doc.id,
        label: doc.data.name || doc.data.title || doc.data.email || doc.id // Try common display fields
      }));
    } catch (error) {
      console.error(`Failed to fetch documents for relation from ${collection}:`, error);
      return [];
    }
  }
}
