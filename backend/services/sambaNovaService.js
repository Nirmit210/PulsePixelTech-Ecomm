const OpenAI = require('openai');

class SambaNovaService {
  constructor() {
    this.client = null;
    this.isEnabled = false;
    this.initializeSambaNova();
  }

  initializeSambaNova() {
    try {
      if (process.env.SAMBANOVA_API_KEY) {
        this.client = new OpenAI({
          apiKey: process.env.SAMBANOVA_API_KEY,
          baseURL: 'https://api.sambanova.ai/v1'
        });
        this.isEnabled = true;
        console.log('✅ SambaNova AI service initialized successfully');
      } else {
        console.log('⚠️ SambaNova API key not found. Using rule-based fallback only.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize SambaNova:', error.message);
      this.isEnabled = false;
    }
  }

  async analyzeIntent(message, context = {}) {
    if (!this.isEnabled) {
      return null; // Fallback to rule-based system
    }

    try {
      const systemPrompt = `You are an intelligent e-commerce chatbot assistant for PulsePixelTech, specializing in digital electronics.

Your task is to analyze user messages and return a JSON response with:
1. intent: One of [product_search, order_tracking, faq, greeting, goodbye, support, product_comparison]
2. confidence: Number between 0 and 1
3. entities: Object with extracted information like {category, budget, features, brand, orderNumber}

Examples:
- "I need a gaming laptop" → {"intent": "product_search", "confidence": 0.9, "entities": {"category": "laptop", "features": ["gaming"]}}
- "Track order #12345" → {"intent": "order_tracking", "confidence": 0.95, "entities": {"orderNumber": "12345"}}
- "What's your return policy?" → {"intent": "faq", "confidence": 0.9, "entities": {}}
- "Hi" → {"intent": "greeting", "confidence": 0.95, "entities": {}}

Respond ONLY with valid JSON.`;

      const response = await this.client.chat.completions.create({
        model: 'Meta-Llama-3.1-8B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 200
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        intent: result.intent,
        confidence: result.confidence,
        entities: result.entities || {},
        source: 'sambanova'
      };

    } catch (error) {
      console.error('SambaNova intent analysis error:', error.message);
      return null; // Fallback to rule-based system
    }
  }

  async generateResponse(intent, entities, context = {}) {
    if (!this.isEnabled) {
      return null; // Fallback to rule-based system
    }

    try {
      const systemPrompt = `You are a helpful e-commerce chatbot for PulsePixelTech, specializing in digital electronics.

Context:
- Intent: ${intent.intent}
- Entities: ${JSON.stringify(entities)}
- User Context: ${JSON.stringify(context)}

Guidelines:
- Be friendly, helpful, and professional
- Keep responses concise (2-3 sentences max)
- Use emojis appropriately
- For product searches, mention you'll help find products
- For order tracking, mention you'll check the status
- For FAQs, provide helpful information
- Always end with a helpful question or suggestion

Respond with a natural, conversational message.`;

      const response = await this.client.chat.completions.create({
        model: 'Meta-Llama-3.1-8B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context.originalMessage || 'Generate appropriate response' }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return {
        message: response.choices[0].message.content.trim(),
        quickReplies: this.generateQuickReplies(intent.intent),
        source: 'sambanova'
      };

    } catch (error) {
      console.error('SambaNova response generation error:', error.message);
      return null; // Fallback to rule-based system
    }
  }

  generateQuickReplies(intent) {
    const quickReplies = {
      product_search: ['Show more options', 'Compare products', 'Filter by price', 'Need help choosing'],
      order_tracking: ['Track package', 'Contact delivery', 'Order history', 'Need help'],
      faq: ['More questions', 'Contact support', 'Browse products', 'Return policy'],
      greeting: ['Find products', 'Track order', 'FAQs', 'Need help'],
      goodbye: ['Browse products', 'Track order', 'Contact support'],
      support: ['Find products', 'Track order', 'FAQs', 'Contact support']
    };

    return quickReplies[intent] || ['Find products', 'Track order', 'Need help'];
  }

  async generateProductDescription(product, userQuery) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      const systemPrompt = `Generate a brief, engaging product description (1-2 sentences) for this product based on the user's query.

Product: ${JSON.stringify(product)}
User Query: ${userQuery}

Focus on features that match the user's needs. Be concise and compelling.`;

      const response = await this.client.chat.completions.create({
        model: 'Meta-Llama-3.1-8B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate description' }
        ],
        temperature: 0.6,
        max_tokens: 100
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('SambaNova product description error:', error.message);
      return null;
    }
  }

  // Health check for SambaNova service
  async healthCheck() {
    if (!this.isEnabled) {
      return { 
        status: 'disabled', 
        reason: 'API key not configured' 
      };
    }

    try {
      // Test with a simple query
      const response = await this.client.chat.completions.create({
        model: 'Meta-Llama-3.1-8B-Instruct',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 10
      });
      
      return {
        status: 'healthy',
        model: 'Meta-Llama-3.1-8B-Instruct',
        response: response.choices[0].message.content
      };
    } catch (error) {
      return {
        status: 'error',
        reason: error.message
      };
    }
  }
}

module.exports = new SambaNovaService();