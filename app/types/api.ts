export type AgentRequest = { 
  userMessage: string;
  privateKey?: string; // Optional private key for embedded wallet
};

export type AgentResponse = { response?: string; error?: string };
