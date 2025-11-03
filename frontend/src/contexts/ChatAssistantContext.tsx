
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatAssistantContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  currentContext: {
    userType: "student" | "researcher" | "research-aide";
    currentTab?: string;
    pageContext?: string;
  };
  setCurrentContext: (context: Partial<ChatAssistantContextType["currentContext"]>) => void;
}

const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined);

export const useChatAssistant = () => {
  const context = useContext(ChatAssistantContext);
  if (!context) {
    throw new Error("useChatAssistant must be used within a ChatAssistantProvider");
  }
  return context;
};

interface ChatAssistantProviderProps {
  children: ReactNode;
}

export const ChatAssistantProvider = ({ children }: ChatAssistantProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentContext, setCurrentContextState] = useState<{
    userType: "student" | "researcher" | "research-aide";
    currentTab?: string;
    pageContext?: string;
  }>({
    userType: "student",
    currentTab: undefined,
    pageContext: undefined
  });

  const setCurrentContext = (newContext: Partial<ChatAssistantContextType["currentContext"]>) => {
    setCurrentContextState(prev => ({ ...prev, ...newContext }));
  };

  return (
    <ChatAssistantContext.Provider 
      value={{ 
        isVisible, 
        setIsVisible, 
        currentContext, 
        setCurrentContext 
      }}
    >
      {children}
    </ChatAssistantContext.Provider>
  );
};
