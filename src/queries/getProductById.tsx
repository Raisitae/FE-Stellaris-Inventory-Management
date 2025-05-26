import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export const getProductById = async (id: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const useGetProductById = () => {
    const { id } = useParams({ from: '/products/$id' });
    return useQuery({ 
        queryKey: ["product", id], 
        queryFn: () => getProductById(id),
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};