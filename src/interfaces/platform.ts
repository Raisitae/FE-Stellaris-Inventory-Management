export interface Platform {
  _id: string;
  name: string;
  manufacturer?: string;
  releaseYear?: number;
  compatibleWith?: string[];
  region?: string;
}
