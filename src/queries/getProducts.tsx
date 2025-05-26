import { useQuery } from "@tanstack/react-query";

export const getProducts = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const useGetProducts = () => {
    return useQuery({ 
        queryKey: ["products"], 
        queryFn: getProducts,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};