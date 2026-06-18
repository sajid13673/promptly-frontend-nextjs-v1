import { getConversations } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useConversation = () => 
    useQuery({
        queryKey: ["conversations"],
        queryFn: getConversations,
        initialData: null,
        select: (response) => response.data
    })