import  { createContext, useState, ReactNode } from 'react';

interface ContentContextType {
  content: string;
  setContent: (content: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContentContext = createContext<ContentContextType | undefined | any>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState('');

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentContext;
