import { MutationFunction, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCRUD(entityKey: string, createAction?: MutationFunction<unknown, void>) {
   const queryClient = useQueryClient();

   const create = useMutation({
      mutationFn: createAction,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [entityKey] });
      },
   });

   return { create };
}
