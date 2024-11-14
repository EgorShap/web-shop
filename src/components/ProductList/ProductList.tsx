import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProductsAndComments, removeProduct } from '../../redux/productsSlice';
import { Product } from '../../models/productModel';
import { Link } from 'react-router-dom';
import Modal from '../Modals/Modal';
import styles from './ProductList.module.css';

const ProductList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector((state) => state.productsSlice);
    const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState<'alphabetical' | 'count' | 'weight'>('alphabetical');
    const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
    const [showModal, setShowModal] = useState(false); // Состояние для модального окна
    const [productToDelete, setProductToDelete] = useState<number | null>(null); // ID товара для удаления

    useEffect(() => {
        if (!products.length && !loading) {
            dispatch(fetchProductsAndComments());
        }
    }, [dispatch, products.length, loading]);

    useEffect(() => {
        // Сортировка продуктов
        const sorted = [...products];
        if (sortOrder === 'alphabetical') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'count') {
            sorted.sort((a, b) => a.count - b.count);
        } else if (sortOrder === 'weight') {
            sorted.sort((a, b) => a.weight - b.weight);
        }

        if (sortDirection === 'descending') {
            sorted.reverse();
        }

        setSortedProducts(sorted);
    }, [products, sortOrder, sortDirection]);

    // Обработчик удаления
    const handleDelete = (productId: number) => {
        setProductToDelete(productId);
        setShowModal(true); // Показываем модальное окно
    };

    const confirmDelete = () => {
        if (productToDelete !== null) {
            dispatch(removeProduct(productToDelete)); // Делаем удаление через Redux
            setShowModal(false); // Закрываем модальное окно
            setProductToDelete(null); // Сброс состояния продукта для удаления
        }
    };

    const cancelDelete = () => {
        setShowModal(false); // Закрываем модальное окно без удаления
        setProductToDelete(null);
    };

    // Функция для обработки изменения сортировки
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortOrder = e.target.value as 'alphabetical' | 'count' | 'weight';
        setSortOrder(newSortOrder);

        // Если сортировка уже по текущему порядку, меняем направление сортировки
        if (newSortOrder === sortOrder) {
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
        } else {
            // Если сортировка по другому параметру, установим направление по умолчанию
            setSortDirection('ascending');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Product List</h1>

            {/* Выпадающий список для сортировки */}
            <div>
                <label htmlFor="sort">Sort by: </label>
                <select id="sort" value={sortOrder} onChange={handleSortChange}>
                    <option value="alphabetical">Name</option>
                    <option value="count">Count</option>
                    <option value="weight">Weight</option>
                </select>

            </div>
            <ul className={styles.productList}>
                {sortedProducts.map((product) => (
                    <li key={product.id} className={styles.productItem}>
                        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                        <Link to={`/product/${product.id}`} className={styles.productLink}>
                            <h2>{product.name}</h2> {/* Делаем название товара ссылкой */}
                        </Link>
                        <p>{product.weight} g</p>
                        <p>{product.count} items in stock</p>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {/* Модальное окно для подтверждения удаления */}
            {showModal && (
                <Modal
                    message="Are you sure you want to delete this product?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default ProductList;


