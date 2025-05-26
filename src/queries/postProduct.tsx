import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

interface Product {
    name: string;
    price: number;
}

export const postProduct = async (product: Product): Promise<Product> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const usePostProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: postProduct,
        onSuccess: () => {
            // Invalidate and refetch products list
            queryClient.invalidateQueries({ queryKey: ["products"] });
            // Navigate back to products list
            navigate({ to: '/products' });
        },
        onError: (error) => {
            console.error('Error in mutation:', error);
            // You might want to show a toast or error message here
        }
    });
};
