/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { messages, language } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    const queryLower = lastMessage.text.toLowerCase().trim();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Try to load mock database
    let services = [];
    try {
      const dataPath = path.join(process.cwd(), 'data');
      const files = await fs.readdir(dataPath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const fileContent = await fs.readFile(path.join(dataPath, file), 'utf-8');
          services.push(JSON.parse(fileContent));
        }
      }
    } catch (err) {
      console.warn("Could not read data directory for mock data fallback.");
    }

    // Smart Context Memory (Cross-questioning)
    // Check if it's a follow-up question (e.g., "what about fees", "how long", "where to apply")
    if (messages.length > 2) {
      // Look at previous bot responses to find context
      const prevBotMessages = messages.filter((m: any) => m.sender === 'bot');
      const lastBotContext = prevBotMessages[prevBotMessages.length - 1]?.text?.toLowerCase() || '';
      
      if (queryLower.includes("fee") || queryLower.includes("cost") || queryLower.includes("money") || queryLower.includes("price")) {
        return NextResponse.json({
          text: "Typically, the application fee is nominal (around ₹50 - ₹200) depending on the state, plus any service charges if you apply via a CSC (Common Service Centre). Let me know if you need the exact link to pay."
        });
      }
      
      if (queryLower.includes("time") || queryLower.includes("how long") || queryLower.includes("days") || queryLower.includes("duration")) {
        return NextResponse.json({
          text: "It usually takes between 7 to 21 working days for processing, provided all your documents are verified successfully. You can track the status online."
        });
      }
      
      if (queryLower.includes("where") || queryLower.includes("link") || queryLower.includes("portal") || queryLower.includes("website")) {
        return NextResponse.json({
          text: "You can apply through your state's e-District portal or the central government website. Would you like me to pull up the exact portal link for you?"
        });
      }
      
      if (queryLower === "yes" || queryLower === "yup" || queryLower === "sure" || queryLower.includes("please")) {
        return NextResponse.json({
          text: "Alright! Please click the 'View Checklist' button on the card above, it contains all the official links and step-by-step instructions."
        });
      }
    }

    // Primary Keyword Matching for Services
    let matchedService = null;
    
    if (queryLower.includes("passport") || queryLower.includes("travel")) {
      matchedService = services.find((s: any) => s.id === "passport");
    } else if (queryLower.includes("drive") || queryLower.includes("licence") || queryLower.includes("license") || queryLower.includes("vehicle")) {
      matchedService = services.find((s: any) => s.id === "driving_licence");
    } else if (queryLower.includes("marriage") || queryLower.includes("wedding")) {
      matchedService = services.find((s: any) => s.id === "marriage_certificate");
    } else if (queryLower.includes("birth") || queryLower.includes("born")) {
      matchedService = services.find((s: any) => s.id === "birth_certificate");
    } else if (queryLower.includes("death")) {
      matchedService = services.find((s: any) => s.id === "death_certificate");
    } else if (queryLower.includes("income") || queryLower.includes("salary")) {
      matchedService = services.find((s: any) => s.id === "income_certificate");
    } else if (queryLower.includes("caste")) {
      matchedService = services.find((s: any) => s.id === "caste_certificate");
    } else if (queryLower.includes("domicile") || queryLower.includes("resident")) {
      matchedService = services.find((s: any) => s.id === "domicile_certificate");
    } else if (queryLower.includes("police") || queryLower.includes("pcc")) {
      matchedService = services.find((s: any) => s.id === "police_clearance");
    } else if (queryLower.includes("voter") || queryLower.includes("election")) {
      matchedService = services.find((s: any) => s.id === "voter_id");
    } else if (queryLower.match(/\bpan\b/) || queryLower.includes("tax")) {
      matchedService = services.find((s: any) => s.id === "pan");
    } else if (queryLower.includes("aadhaar")) {
      matchedService = services.find((s: any) => s.id === "aadhaar");
    }

    if (matchedService) {
      return NextResponse.json({
        text: language === 'hi' 
          ? `मैं आपके ${matchedService.name} के साथ आपकी मदद कर सकता हूँ। यहाँ एक त्वरित सारांश और चेकलिस्ट है:` 
          : `I can certainly help you with your ${matchedService.name}. Here is a quick summary and a checklist card you can use to start the process:`,
        hasCard: true,
        serviceData: {
          name: matchedService.name,
          time: matchedService.estimated_processing_time,
          fee: matchedService.application_fee,
          link: matchedService.official_apply_link
        }
      });
    }

    // Default Fallback
    return NextResponse.json({
      text: language === 'hi'
        ? "मुझे उस विशिष्ट प्रक्रिया के बारे में ठीक से पता नहीं है। क्या आप थोड़ा और विवरण दे सकते हैं?"
        : "I'm not exactly sure about that specific procedure. Could you provide a bit more detail?"
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
