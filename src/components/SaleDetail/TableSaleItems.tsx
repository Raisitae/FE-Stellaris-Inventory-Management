import type { Product } from "@/interfaces/product";

interface TableSaleItemsProps {
  products: Product[];
}

export const TableSaleItems = ({ products }: TableSaleItemsProps) => {
  return (
    <>
      {products.map((item: Product) => (
        <tr key={item._id} className="hover:bg-indigo-50">
          <td className="px-4 py-2 border-b">{item.name}</td>
          <td className="px-4 py-2 border-b">{item.category}</td>
          <td className="px-4 py-2 border-b">{item.platformId}</td>
          <td className="px-4 py-2 border-b">${item.price.toFixed(2)}</td>
          <td className="px-4 py-2 border-b">{item.stock}</td>
          <td className="px-4 py-2 border-b">{item.status}</td>
        </tr>
      ))}
    </>
  );
};
