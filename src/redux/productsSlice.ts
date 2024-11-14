import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../models/productModel";

interface Comment {
  id: number;
  productId: number;
  description: string;
  date: string;
}

// Тип состояния с продуктами и комментариями
interface ProductsState {
  products: Product[]; // Массив продуктов
  loading: boolean; // Статус загрузки
  error: string | null; // Сообщение об ошибке
}

const initialState: ProductsState = {
  products: [], // Изначально пустой массив продуктов
  loading: false, // Начинаем с состояния загрузки
  error: null, // Ошибок нет
};

// Thunk для получения продуктов и их комментариев
export const fetchProductsAndComments = createAsyncThunk<Product[]>(
  "products/fetchProductsAndComments",
  async () => {
    const [productsResponse, commentsResponse] = await Promise.all([
      axios.get<Product[]>("http://localhost:3001/products"),
      axios.get<Comment[]>("http://localhost:3001/comments"),
    ]);

    const products = productsResponse.data;
    const comments = commentsResponse.data;

    // Добавляем комментарии в каждый продукт
    return products.map((product) => ({
      ...product,
      comments: comments.filter((comment) => comment.productId === product.id),
    }));
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id: number) => {
    await axios.delete(`http://localhost:3001/products/${id}`); // Запрос на удаление товара
    return id; // Возвращаем ID удаленного товара
  }
);

// Слайс для работы с продуктами и комментариями
const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Статус загрузки продуктов и комментариев
      .addCase(fetchProductsAndComments.pending, (state) => {
        state.loading = true;
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(
        fetchProductsAndComments.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload; // Загружаем продукты с комментариями
        }
      )
      .addCase(fetchProductsAndComments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch products and comments"; // Обработка ошибки
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      });
  },
});

// Экспорты
export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
