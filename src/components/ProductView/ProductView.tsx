import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Product } from '../../models/productModel';
import { useParams, useNavigate } from 'react-router-dom';

const ProductView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const products = useSelector((state: RootState) => state.productsSlice.products);
    const [product, setProduct] = useState<Product | null>(null);

    // Загружаем продукт, если он не загружен
    useEffect(() => {
        if (!id) return;

        const foundProduct = products.find((p) => p.id === parseInt(id, 10));
        if (foundProduct) {
            setProduct(foundProduct);
        }
    }, [id, products]);

    if (!product) return <div>Product not found</div>;
    return (
        <div>
            <h1>{product.name}</h1>
            <img src={product.imageUrl} alt={product.name} />
            <p>{product.description}</p>
            <p>Count: {product.count}</p>
            <p>Weight: {product.weight}</p>
            <ul>
                {product.comments.map((comment) => (
                    <li key={comment.id}>
                        <p>{comment.description}</p>
                        <p>{comment.date}</p>
                    </li>
                ))}
            </ul>



            {/* Кнопка для возврата к списку товаров */}
            <button onClick={() => navigate('/')}>Back to Products List</button>
        </div>

    );
};

export default ProductView;
