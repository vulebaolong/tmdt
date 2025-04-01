import {
   addToCartAction,
   deleteCartItemAction,
   getCartCountAction,
   getCartListAction,
   TAddToCartAction,
   TPayloadGetCart,
   updateQuantityAction,
} from "@/actions/cart.action";
import { resError } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { useDebouncedCallback } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useCartCountQuery() {
   return useQuery({
      queryKey: ["cart-count"],
      queryFn: async () => {
         return await getCartCountAction();
      },
   });
}

export function useAddToCart() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TAddToCartAction) => {
         const data = await addToCartAction(payload);
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`cart-count`] });
      },
      onError: (error) => {
         console.error("useAddToCart:", error);
         toast.error(resError(error, `Add To Cart failed`));
      },
   });
}

export const useGetCartList = (params: TPayloadGetCart) => {
   return useQuery({
      queryKey: ["cart-list", params],
      queryFn: async () => {
         return await getCartListAction(params);
      },
   });
};

export const useUpdateQuantity = () => {
   return useMutation({
      mutationFn: (payload: { productId: string; quantity: number }) => updateQuantityAction(payload),
   });
};

type TItem = {
   productId: IProduct;
   quantity: number;
};

type TCartState = Record<
   string,
   {
      quantity: number;
      priceItemCart: number;
      shipItemCart: number;
   }
>;
export function useHandleCart(cartItems: TItem[]) {
   console.log({ cartItems });
   const [cartState, setCartState] = useState<TCartState>({});
   const queryClient = useQueryClient();

   useEffect(() => {
      if (cartItems.length === 0) return;
      const initialState: TCartState = {};
      cartItems.forEach((item) => {
         initialState[item.productId._id as string] = {
            quantity: item.quantity,
            priceItemCart: item.quantity * item.productId.price,
            shipItemCart: item.productId.shippingFee,
         };
      });
      setCartState(initialState);
   }, [cartItems]);

   const debouncedUpdate = useDebouncedCallback((productId: string, quantity: number) => {
      console.log(`calling updateQuantityAction with productId: ${productId}, quantity: ${quantity}`);
      updateQuantityAction({ productId, quantity })
         .then(() => {
            queryClient.invalidateQueries({ queryKey: [`cart-count`] });
         })
         .catch(() => {
            const originalItem = cartItems.find((item) => item.productId._id === productId);
            if (originalItem) {
               setCartState((prev) => ({
                  ...prev,
                  [productId]: {
                     quantity: originalItem.quantity,
                     priceItemCart: originalItem.quantity * originalItem.productId.price,
                     shipItemCart: originalItem.productId.shippingFee,
                  },
               }));
            }
         });
   }, 500);

   const handleQuantityChange = (productId: string, quantity: number) => {
      const product = cartItems.find((item) => item.productId._id === productId);
      if (!product) return;
      setCartState((prev) => ({
         ...prev,
         [productId]: {
            quantity,
            priceItemCart: quantity * product.productId.price,
            shipItemCart: product.productId.shippingFee,
         },
      }));
      debouncedUpdate(productId, quantity);
   };

   const totalPriceItemCart = Object.values(cartState).reduce((sum, item) => sum + item.priceItemCart, 0);
   const totalShipItemCart = Object.values(cartState).reduce((sum, item) => sum + item.shipItemCart, 0);
   const totalPriceCart = totalPriceItemCart + totalShipItemCart;

   return { cartState, handleQuantityChange, totalPriceItemCart, totalShipItemCart, totalPriceCart };
}

export function useDeleteCartItem() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteCartItemAction,
      onSuccess: () => {
         toast.success(`Đã xoá sản phẩm khỏi giỏ hàng`);
         queryClient.invalidateQueries({ queryKey: ["cart-list"] });
         queryClient.invalidateQueries({ queryKey: [`cart-count`] });
      },
      onError: () => {
         toast.error(`Xoá sản phẩm thất bại`);
      },
   });
}
