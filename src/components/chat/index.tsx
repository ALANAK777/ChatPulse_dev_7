import FeatureCard from "@/components/other/feature-card";
import BouncingLoader from "@/components/ui/bouncing-loader";
import { SpinnerCentered } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useState, useRef, useEffect,useCallback  } from "react";
import { useChatStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { PLANS } from '@/lib/constants';
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { BanIcon, Send, ChevronRight, X, ArrowLeft,Loader2,Search, CopyIcon, DeleteIcon, Trash } from "lucide-react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { Plan } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
const Research: React.FC<{ 
  setisopen: React.Dispatch<React.SetStateAction<boolean>>,
  docId: string,
  subscriptionDetails: any, // Replace 'any' with the actual type of subscriptionDetails
  plan: string // Assuming plan is a string, adjust if it's a different type
}> = ({ setisopen, docId, subscriptionDetails, plan }) => {
  const [pdfSummary, setPdfSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdf, setpdf] = useState(true);
  const [query, setQuery] = useState('');
  const [tavilyResponse, setTavilyResponse] = useState<any>(null);
  const [serperResponse, setSerperResponse] = useState<any>(null);
  const [SerperVideos, setSerperVideos] = useState<any>(null);
  const [SerperNews, setSerperNews] = useState<any>(null);
  const [response, setResponse] = useState<string>('');
  const [allResponses, setAllResponses] = useState<any[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const organicResultsRef = useRef<HTMLDivElement>(null);
  const messageWindowRef = useRef<HTMLDivElement>(null);
  const [load,setload]=useState(false);


  const [researchCount, setResearchCount] = useState(0);
  const { data: previousResponses } = api.research.getPreviousResponses.useQuery({ documentId:docId });

  const storeResponseMutation = api.research.storeResponse.useMutation();

  const { data: researchResponse, isLoading: researchIsLoading } = api.research.getSummary.useQuery(
    { docId: docId as string },
    { enabled: !!docId, refetchOnWindowFocus: false }
  );

  const incrementResearchCount = api.document.incrementResearchCount.useMutation({
    onSuccess: (data) => {
  
      
      setResearchCount(newCount => {
        
        return data.researchCount;
      });
    },
  });
  






  
  useEffect(() => {
   
    
    if (previousResponses) {
      setAllResponses(previousResponses);
    
      
     
    }
    setload(true)
  }, [previousResponses]);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  
  useEffect(() => {
    if (messageWindowRef.current) {
      const shouldScroll = 
        !userHasScrolled || 
        messageWindowRef.current.scrollTop + messageWindowRef.current.clientHeight === messageWindowRef.current.scrollHeight;
  
      if (shouldScroll) {
        messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
      }
    }
  }, [response, previousResponses, allResponses, userHasScrolled]);
  
  useEffect(() => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTo({
        top: messageWindowRef.current.scrollHeight,
        behavior: 'auto'
      });
    }
  }, []);
  const handleScroll = useCallback(() => {
    if (organicResultsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = organicResultsRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Load more results
        // loadMoreResults();
      }
    }
  }, []);
  useEffect(() => {
  
    setResearchCount(researchCount);
  }, [researchCount]);

  useEffect(() => {
    if (researchResponse) {
      setPdfSummary(researchResponse);
      // console.log("PDF Summary1:", researchResponse);
      // console.log("PDF by state:", pdfSummary);
    }
  }, [researchResponse]);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };
  

  const handleSubmit = async () => {
    if (pdfSummary && query) {
      try {
        setIsLoading(true);
        setResponse('');
         console.log("for context is", pdfSummary);
        const contextualQuery = pdf ? `${query} (give answer related to this keywords: ${pdfSummary})` : query;
        const contextualQuery1 = pdf ? `${query} (search by this keywords: ${pdfSummary})` : query;
        const filledQuery = contextualQuery.length < 5 ? contextualQuery + ' '.repeat(5 - contextualQuery.length) : contextualQuery;
        const filledQuery1 = contextualQuery1.length < 5 ? contextualQuery1 + ' '.repeat(5 - contextualQuery1.length) : contextualQuery1;

        const [serperResponse, tavilyResult, serperVideos, serperNews] = await Promise.all([
          fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': process.env.NEXT_PUBLIC_SERPER_API_KEY || '',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              q: contextualQuery,
              gl: 'us',
              hl: 'en',
              autocorrect: true
            })
          }),
          tavilySearch(filledQuery, 5, 'basic', [], []),
          fetch('https://google.serper.dev/videos', {
            method: 'POST',
            headers: {
              'X-API-KEY': process.env.NEXT_PUBLIC_SERPER_API_KEY || '',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              q: filledQuery1,
              gl: 'us',
              hl: 'en'
            })
          }),
          fetch('https://google.serper.dev/news', {
            method: 'POST',
            headers: {
              'X-API-KEY': process.env.NEXT_PUBLIC_SERPER_API_KEY || '',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              q: filledQuery,
              gl: 'us',
              hl: 'en'
            })
          })
        ]);

        const serperData = await serperResponse.json();
        const serperVideosData = await serperVideos.json();
        const serperNewsData = await serperNews.json();

        const newResponse = {
          query,
          serperResponse: serperData,
          tavilyResponse: tavilyResult,
          serperVideos: serperVideosData,
          serperNews: serperNewsData,
        };

        await storeResponseMutation.mutateAsync({
          query: newResponse.query,
          serperResponse: newResponse.serperResponse,
          tavilyResponse: newResponse.tavilyResponse,
          serperVideos: newResponse.serperVideos,
          serperNews: newResponse.serperNews,
          documentId: docId as string
        });
        
        await incrementResearchCount.mutateAsync({ documentId: docId });
        setAllResponses(prevResponses => [...prevResponses, newResponse]);
        setSerperResponse(serperData);
        setTavilyResponse(tavilyResult);
        setSerperVideos(serperVideosData);
        setSerperNews(serperNewsData);
        setQuery('');
        setIsLoading(false);

        // console.log("research count",researchCount);

        // console.log('Serper API Response:', serperData);
        // console.log('Tavily API Response:', tavilyResult);
        // console.log('Serper Videos Response:', serperVideosData);

        const combinedResponse = `Serper API Response: ${JSON.stringify(serperData)}\n\nTavily API Response: ${JSON.stringify(tavilyResult)}`;
        for (let i = 0; i < combinedResponse.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 20));
          setResponse(prev => prev + combinedResponse[i]);
        }
      } catch (error) {
        console.error('Error querying APIs:', error);
        setIsLoading(false);
      }
    }
  };
  
  async function tavilySearch(
    query: string,
    maxResults: number = 10,
    searchDepth: 'basic' | 'advanced' = 'basic',
    includeDomains: string[] = [],
    excludeDomains: string[] = []
  ): Promise<any> {
    const apiKey = process.env.NEXT_PUBLIC_TAVILY_API_KEY;
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults < 5 ? 5 : maxResults,
        search_depth: searchDepth,
        include_images: true,
        include_answer: true,
        include_domains: includeDomains,
        exclude_domains: excludeDomains
      })
    });
  
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Tavily API Error: ${response.status} - ${errorBody}`);
    }
    
  
    const data = await response.json();
    return data;
  }
  const router=useRouter();
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (plan === 'FREE' && 
          ((researchCount !== null && researchCount >= PLANS.FREE.maxresearch))) {
            toast.error(
              <div>
                <p className=" text-lg leading-relaxed text-gray-700">{`Daily limit ${PLANS.FREE.maxresearch} queries reached. Come back tomorrow or upgrade to PRO!`}</p>
                <Button 
                  onClick={() => router.push('/upgrade-plans')} 
                  variant="default"
                  className="mt-1"
                >
                  Upgrade Now
                </Button>
              </div>,
              {
                duration: 1000,
              }
            );
      } else if (plan=== 'PRO') {
        if (new Date() > new Date(subscriptionDetails.subscriptionEndDate!)) {
          toast.error("Your PRO subscription has expired. Please renew to continue.", { duration: 3000 });
        } else if (subscriptionDetails.subscriptionStatus !== 'active') {
          toast.error("Your PRO subscription is not active. Please check your account.", { duration: 3000 });
        } else if (
                   (researchCount !== null && researchCount >= PLANS.PRO.maxresearch)) {
          toast.error("You've reached the PRO plan limit for today.", { duration: 3000 });
        } else {
          handleSubmit();
        }
      } else {
        handleSubmit();
      }
    }
  };
  
 
  
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-white sm:rounded-lg sm:border sm:shadow-lg relative">
      <div className="flex items-center justify-between p-1 border-b mt-4">
        <button onClick={() => setisopen(false)} className="text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center bg-gray-200 rounded-full p-1 shadow-inner">
          <button
            onClick={() => setpdf(true)}
            className={`px-4 py-2 rounded-full transition-all ${
              pdf ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
            }`}
          >
            PDF
          </button>
          <button
            onClick={() => setpdf(false)}
            className={`px-4 py-2 rounded-full transition-all ${
              !pdf ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
            }`}
          >
            General
          </button>
        </div>
      </div>
      <div ref={messageWindowRef} 
      onScroll={() => {
        if (messageWindowRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = messageWindowRef.current;
          setUserHasScrolled(scrollTop + clientHeight < scrollHeight);
        }
      }}
      className="flex-1 overflow-y-auto p-4 space-y-6 ">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
              <p className="mt-2 text-gray-600">Searching for the best response...</p>
            </div>
          </div>
        )}
        {load ?(
       allResponses.map((response, index) => (
          <div key={index}>
            {response.tavilyResponse && (
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">

<div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold">User Query:</h3>
        <p>{response.query}</p>
      </div>
                {response.tavilyResponse.answer && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Answer</h3>
                    <p className="text-gray-700">{response.tavilyResponse.answer}</p>
                  </div>
                )}
                {response.tavilyResponse.images && response.tavilyResponse.images.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Images</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {response.tavilyResponse.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Result ${index + 1}`}
                          className="w-full h-auto rounded-md shadow-sm cursor-pointer"
                          onClick={() => openImageModal(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {isImageModalOpen && (
                  <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg overflow-hidden relative" style={{ width: '90%', maxWidth: '800px', maxHeight: '90%' }}>
                      <Carousel className="w-full h-full">
                        <CarouselContent>
                          {response.tavilyResponse.images?.map((image: string, index: number) => (
                            <CarouselItem key={index}>
                              <div className="flex items-center justify-center p-4">
                                <img
                                  src={image}
                                  alt={`Result ${index + 1}`}
                                  className="max-w-full max-h-[60vh] object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md" />
                        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md" />
                      </Carousel>
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsImageModalOpen(false)}
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                )}
                {response.tavilyResponse.results && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Useful Links</h3>
                    {response.tavilyResponse.results.map((result: any, index: number) => (
                      <div key={index} className="mb-2">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline visited:text-purple-600">
                          {result.title}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {response.serperVideos.videos.length>0 && (
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Videos</h3>
                <div className="grid grid-cols-2 gap-6">
                  {response.serperVideos.videos
                    .filter((video: { link: string }) =>
                      video.link.includes('youtube.com') ||
                      video.link.includes('youtu.be') ||
                      (video.link.includes('facebook.com') && video.link.includes('/videos/'))
                    )
                    .map((video: { imageUrl: string; title: string; link: string; duration: string }, index: number) => (
                      <div className="video-item bg-white rounded-lg overflow-hidden shadow-sm relative group">
                      <img src={video.imageUrl} alt={video.title} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-white font-semibold">{video.duration}</span>
                      </div>
                      <div className="p-4">
                        <a href={video.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline visited:text-purple-600 text-sm font-medium">
                          {video.title}
                        </a>
                      </div>
                    </div>
                    ))}
                </div>
              </div>
            )}
            {response.serperNews.news.length>0 && (
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent News</h3>
                {response.serperNews.news.map((newsItem: { link: string; title: string; snippet: string }, index: number) => (
                  <div key={index} className="news-item mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline visited:text-purple-600 font-medium">
                      {newsItem.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{newsItem.snippet}</p>
                  </div>
                ))}
              </div>
            )}
            {response.serperResponse.organic.length>0 && (
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                {response.serperResponse.organic && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Resources</h3>
                    <div ref={organicResultsRef} className="flex overflow-x-auto pb-4" onScroll={handleScroll}>
                      {response.serperResponse.organic.map((result: any, index: number) => (
                        <div key={index} className="flex-shrink-0 w-64 p-4 mr-4 bg-white rounded-lg shadow-sm">
                          <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline visited:text-purple-600 font-medium">
                            {result.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {response.serperResponse.peopleAlsoAsk && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">People Also Ask</h3>
                    {response.serperResponse.peopleAlsoAsk.map((item: any, index: number) => (
                      <div key={index} className="mb-2 p-3 bg-white rounded-lg">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline visited:text-purple-600">
                          {item.question}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))): (<Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />)}
      </div>
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
      <div className="flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleEnterPress}
            placeholder="Enter your query"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <button
  onClick={(e) => {
    if (plan === 'FREE' && researchCount > PLANS.FREE.maxresearch) {
      e.preventDefault();
      toast.error(
        <div>
          <p className=" text-lg leading-relaxed text-gray-700">{`Daily limit ${PLANS.FREE.maxresearch} queries reached. Come back tomorrow or upgrade to PRO!`}</p>
          <Button 
            onClick={() => router.push('/upgrade-plans')} 
            variant="default"
            className="mt-1"
          >
            Upgrade Now
          </Button>
        </div>,
        {
          duration: 1000,
        }
      );
    } else if (plan === 'PRO') {
      if (new Date() > new Date(subscriptionDetails.subscriptionEndDate!)) {
        e.preventDefault();
        toast.error("Your PRO subscription has expired. Please renew to continue.", { duration: 3000 });
      } else if (subscriptionDetails.subscriptionStatus !== 'active') {
        e.preventDefault();
        toast.error("Your PRO subscription is not active. Please check your account.", { duration: 3000 });
      } else if (researchCount >= PLANS.PRO.maxresearch) {
        e.preventDefault();
        toast.error("You've reached the PRO plan research limit for today.", { duration: 3000 });
      } else {
        handleSubmit();
      }
    } else {
      handleSubmit();
    }
  }}
  className={`group w-fit rounded-ee-md rounded-se-md px-2 ${
    isLoading ||
    (plan === 'FREE' && researchCount > PLANS.FREE.maxresearch) ||
    (plan === 'PRO' &&
      (new Date() > new Date(subscriptionDetails.subscriptionEndDate!) ||
      subscriptionDetails.subscriptionStatus !== 'active' ||
      researchCount >= PLANS.PRO.maxresearch))
      ? 'opacity-50'
      : ''
  }`}
>
 <Send   size={24} className="text-gray-600 group-hover:text-gray-700"/>
</button>


       </div>
      </div>
    </div>
  );
}  

export default function Chat({ isVectorised }: { isVectorised: boolean }) {
  const { query } = useRouter();
  const [isopen, setisopen] = useState(false);
  
  
  const docId = query?.docId as string;
  interface SubscriptionDetails {
    plan: string;
    subscriptionEndDate: string | null;
    subscriptionStatus: string | null;
    subscriptionStartDate: string | null;
    subscriptionId: string | null;
  }
  
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatIsLoading,
    stop,
    error,
    setMessages,
    append,
  } = useChat({
    body: {
      docId: docId,
    },

    onError: (err: any) => {
      toast.error(err?.message, {
        duration: 3000,
      });
    },
  });
 

const router = useRouter();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>({
    plan: "",
    subscriptionEndDate: null,
    subscriptionStatus: null,
    subscriptionStartDate: null,
    subscriptionId: null,
  });
 const[load,setload]=useState(false);
  
 
  const deleteChatsMutation = api.document.deleteAllChats.useMutation({
    onSuccess: () => {
      toast.success("Chat history deleted successfully");
      setIsOpen(false);
      setload(false);
      setMessages([]);
    },
    onError: (error) => {
      toast.error(`Failed to delete chat history: ${error.message}`);
    },
  });

  const handleDeleteChats = () => {
   
    deleteChatsMutation.mutate();
    setload(true);
  };
  const [chatCount, setChatCount] = useState<number | null>(null);
  const { setSendMessage } = useChatStore();
  const { data: userData, isLoading: isUserLoading } = api.document.getUserPlan.useQuery(
    { userId: userId as string },
    {
      enabled: !!userId,
      onSuccess: (data: { plan: string }) => {
        setUserPlan(data.plan );
      },    }
  );
  
  const { data: subdata, isLoading } = api.document.getSubscriptionDetails.useQuery(
    { userId: userId as string },
    {
      enabled: !!userId,
      onSuccess: (data) => {
        setSubscriptionDetails({
          plan: data.plan || "",
          subscriptionEndDate: data.subscriptionEndDate ? data.subscriptionEndDate.toISOString() : null,
          subscriptionStatus: data.subscriptionStatus || null,
          subscriptionStartDate: data.subscriptionStartDate ? data.subscriptionStartDate.toISOString() : null,
          subscriptionId: data.subscriptionId || null,
        });
      },    }
  );

const { data: documentCountData, isLoading: isDocumentCountLoading } = api.document.getChatCount.useQuery(
    { documentId: docId },
    {
      enabled: !!docId,
      onSuccess: (data:{chatCount :number}) => {
        setChatCount(data.chatCount);
      },
      refetchInterval: 60000,
    }
);

  // console.log("user plan",userPlan,"chatcount",chatCount)
  // console.log("sub details",subscriptionDetails)
  useEffect(() => {
    const sendMessage = (message: string) => {
      append({
        id: crypto.randomUUID(),
        content: message,
        role: "user",
      });
    };

    setSendMessage(sendMessage);
  }, []);
 
  //implement autoscrolling, and infinite loading => also fetch the messages from prev session and display
  const { data: prevChatMessages, isLoading: isChatsLoading } =
    api.message.getAllByDocId.useQuery(
      {
        docId: docId,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  const messageWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageWindowRef.current?.scrollTo(
      0,
      messageWindowRef.current.scrollHeight,
    );
  }, [messages, prevChatMessages]);

  const { mutate: vectoriseDocMutation, isLoading: isVectorising } =
    api.document.vectorise.useMutation({
      onSuccess: () => {
        utils.document.getDocData.setData(
          { docId: docId },
          (prev) => {
            if (!prev) return undefined;
            return {
              ...prev,
              isVectorised: true,
            };
          },
        );
      },
    });

  const utils = api.useContext();
  
  if (!isVectorised) {
    return (
      <FeatureCard
        isLoading={isVectorising}
        bulletPoints={[
          "🔍 Search and ask questions about any part of your PDF.",
          "📝 Summarize content with ease.",
          "📊 Analyze and extract data effortlessly.",
        ]}
        onClick={() => {
          vectoriseDocMutation(
            { documentId: docId },
            {
              onError: (err: any) => {
                toast.error(err?.message, {
                  duration: 3000,
                });
              },
            },
          );
        }}
        buttonText="Turn PDF Interactive"
        subtext="Easily extract key information and ask questions on the fly:"
        title="Unleash the power of your PDF documents through interactive chat!"
      />
    );
  }
 const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.error(`Copied!`, {
        duration: 1000});
      // console.log('Message copied to clipboard');
      // You can add a toast notification here if desired
    }).catch((err) => {
      console.error('Failed to copy message: ', err);
    });
  };


  if (isChatsLoading) {
    return <SpinnerCentered />;
  }

  return (
    <>
      {isopen ? (
        <Research plan={userPlan ?? ''} subscriptionDetails={subscriptionDetails} setisopen={setisopen} docId={docId} />
      ) : (
        <>
        
        <div className="flex justify-end mb-5 items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="mr-4 text-sm font-medium text-red-600 hover:text-red-800 border  rounded px-2 py-1">
     Delete 
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete chat history?</DialogTitle>
        </DialogHeader>
        <p>This action will delete your entire chat history. This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteChats}> {!load ? (
  <p>Delete</p>
) : (
  <Loader2 className="animate-spin mr-2 h-4 w-4" />
)}
  </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  

    <button
  onClick={() => setisopen(true)}
  className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-full shadow-md hover:shadow-lg transform hover:scale-105"
>
  <Search className="mr-2 h-4 w-4" />
  Resources
</button>

</div>


<div className="flex h-[calc(100%-10%)] w-full flex-col overflow-hidden">

          <div
  className="hideScrollbar flex-1 overflow-auto pb-4"
  ref={messageWindowRef}
>
  {[
    {
      id: "id",
      content:
        "Welcome to **ChatPulse**! I'm here to assist you. Feel free to ask questions or discuss topics based on the data provided. Whether it's clarifying information, diving deeper into a subject, or exploring related topics, I'm ready to help. Let's make the most out of your learning!",
      role: "assistant",
    },
    ...(prevChatMessages ?? []),
    ...messages,
  ].map((m) => (
    <div
      key={m.id}
      className={cn(
        "flex",
        m.role === "user" ? "justify-end" : "justify-start",
        "w-full mb-3",
        m.role === "assistant" && "mr-auto",
        "max-w-[100%] text-left mb-3"
      )}
    >
   <div className="relative">
  <ReactMarkdown
    className={cn(
      m.role === "user" &&
        "bg-blue-500 text-gray-50 prose-code:text-gray-100 text-left ml-auto",
      m.role === "assistant" && "bg-gray-100",
      "prose rounded-xl px-3 py-1 prose-ul:pl-2 prose-li:px-2",
      m.role === "assistant" && "mb-6" // Added mb-6 for bottom margin only for assistant messages
    )}
  >
    {m.content}
  </ReactMarkdown>
  {m.role === "assistant" && (
    <div className="absolute bottom-1 left-1 flex space-x-3">
      <button
        onClick={() => copyToClipboard(m.content)}
        className="text-gray-500 hover:text-gray-700"
      >
        <CopyIcon className="w-4 h-4" />
      </button>
     
    </div>
  )}
</div>

    </div>
  ))}

  {chatIsLoading && messages.at(-1)?.role === "user" && (
    <div
      className={cn(
        "mr-auto bg-gray-100 text-black",
        "max-w-[10%] rounded-xl px-3 py-2 text-left"
      )}
    >
      <BouncingLoader />
    </div>
  )}
</div>

  
            <div className="sticky bottom-0 bg-white">
              <form onSubmit={handleSubmit}>
                <div className="flex w-full">
                <TextareaAutosize
  maxLength={1000}
  placeholder="Enter your question (max 1,000 characters)"
  className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 font-normal"
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userPlan === 'FREE' && chatCount !== null && chatCount > PLANS.FREE.maxchat) {
        toast.error(
          <div>
            <p className=" text-lg leading-relaxed text-gray-700">{`Daily limit ${PLANS.FREE.maxchat} queries reached. Come back tomorrow or upgrade to PRO!`}</p>
            <Button 
              onClick={() => router.push('/upgrade-plans')} 
              variant="default"
              className="mt-1"
            >
              Upgrade Now
            </Button>
          </div>,
          {
            duration: 1000,
          }
        );
      } else if (userPlan === 'PRO') {
        if (new Date() > new Date(subscriptionDetails.subscriptionEndDate!)) {
          toast.error("Your PRO subscription has expired. Please renew to continue.", {
            duration: 3000});
        } else if (subscriptionDetails.subscriptionStatus !== 'active') {
          toast.error("Your PRO subscription is not active. Please check your account.");
        } else if (chatCount !== null && chatCount >= PLANS.PRO.maxchat) {
          toast.error("You've reached the PRO plan chat limit for today.", {
            duration: 3000});
        } else {
          // @ts-ignore
          handleSubmit(e);
        }
      } else {
        // @ts-ignore
        handleSubmit(e);
      }
    }
  }}
  value={input}
  onChange={handleInputChange}
  autoFocus
  maxRows={4}
/>


                  {chatIsLoading ? (
                    <button className="w-fit px-2">
                      <BanIcon size={24} className="text-gray-500" onClick={stop} />
                    </button>
                  ) : (
                    <button
                    className={`group w-fit rounded-ee-md rounded-se-md px-2 ${
                      (userPlan === 'FREE' && chatCount !== null && chatCount > PLANS.FREE.maxchat) ||
                      (userPlan === 'PRO' &&
                       (new Date() > new Date(subscriptionDetails.subscriptionEndDate!) ||
                        subscriptionDetails.subscriptionStatus !== 'active' ||
                        (chatCount !== null && chatCount >= PLANS.PRO.maxchat)))
                        ? 'opacity-50'
                        : ''
                    }`}
                    type="submit"
                    onClick={(e) => {
                      if (userPlan === 'FREE' && chatCount !== null && chatCount >= PLANS.FREE.maxchat) {
                        e.preventDefault();
                        toast.error(
                          <div>
                            <p className=" text-lg leading-relaxed text-gray-700">{`Daily limit ${PLANS.FREE.maxchat} queries reached. Come back tomorrow or upgrade to PRO!`}</p>
                            <Button 
                              onClick={() => router.push('/upgrade-plans')} 
                              variant="default"
                              className="mt-1"
                            >
                              Upgrade Now
                            </Button>
                          </div>,
                          {
                            duration: 1000,
                          }
                        );
                                                      
                                          
                      } else if (userPlan === 'PRO') {
                        if (new Date() > new Date(subscriptionDetails.subscriptionEndDate!)) {
                          e.preventDefault();
                          toast.error("Your PRO subscription has expired. Please renew to continue.", {
                            duration: 3000});
                        } else if (subscriptionDetails.subscriptionStatus !== 'active') {
                          e.preventDefault();
                          toast.error("Your PRO subscription is not active. Please check your account.", {
                            duration: 3000});
                        } else if (chatCount !== null && chatCount >= PLANS.PRO.maxchat) {
                          e.preventDefault();
                          toast.error("You've reached the PRO plan chat limit for today.", {
                            duration: 3000});
                        }
                      }
                      // If none of the conditions are met, the form will submit normally
                    }}
                  >
                    <Send
                      size={24}
                      className="text-gray-600 group-hover:text-gray-700"
                    />
                  </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}