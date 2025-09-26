"use client";
import { getConversationById } from '@/lib/api';
import type { Conversation } from '@/types/Conversation';
import { Message } from '@/types/Message';
import React, { use, useEffect, useState } from 'react'

function Conversation({params} : { params: Promise<{chatId: string}>}) {
    const {chatId} = use(params)
    const [conversation, setConversation] = useState<Conversation | null>(null)
    console.log('conversation', chatId);
    
    const fetchConversation = async () => {
      const res = await getConversationById(chatId);
      setConversation(res.data)
    }


    useEffect(() => {
      fetchConversation()
    }, [])
    
  return (
    <div className='flex flex-col flex-1 items-end p-5'>
      {conversation?.messages &&
    conversation.messages.map((message: Message) => {
      const isUser = message.role === 'USER';
      return (
        <div
          key={message.id}
          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`text-lg p-2 rounded-md max-w-[75%] ${
              isUser
                ? 'bg-blue-100 text-blue-800 text-right'
                : 'bg-gray-100 text-gray-800 text-left'
            }`}
          >
            {message.message}
          </div>
        </div>
      );
    })}

    </div>
  )
}

export default Conversation