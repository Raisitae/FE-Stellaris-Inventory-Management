import { useQueryClient } from '@tanstack/react-query'

export function useAuth() {
  const queryClient = useQueryClient()

  const logout = async () => {
    // Clear any auth-related data
    queryClient.clear()
    // You might want to call your logout API endpoint here
  }

  return {
    logout
  }
} 