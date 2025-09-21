import axios from "axios";
import { ScrapedImage } from "./scrape";

interface Product {
  name: string;
  description: string;
  price: number | null;
  storeId: string;
}

interface ProcessingResult {
  success: boolean;
  imageUrl: string;
  result?: any;
  error?: string;
  parsedProduct?: Product;
}

const SYSTEM_PROMPT = `Analyze product images and create marketable product listings.

Focus on:
1. Visual analysis of the product
2. Text/overlays in the image
3. Alt text only if useful

Create SEO-friendly names and compelling descriptions (100-200 chars).

Return valid JSON:
{
    "name": "Product name",
    "description": "Marketing description",
    "price": null,
    "storeId": "PROVIDED_STORE_ID",
    "category": "Product category"
}`;

export async function processImage(imageItem: ScrapedImage, storeId: string): Promise<ProcessingResult> {
  try {
    const response = await axios.post(
      "https://api.winfunc.com/openai/v1/responses",
      {
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: SYSTEM_PROMPT }],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Create a product listing for store "${storeId}". Alt text: "${imageItem.alt}"`,
              },
              {
                type: "input_image",
                image_url: imageItem.src,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk-winfunc-kgj6E27j7o-kY3u_Lft_HtjRIJnSMB1BnZszwFoh5YD20dLbXPDg1ksgPj0-4Otv`,
        },
      }
    );

    let parsedProduct: Product | undefined;
    try {
      const responseText =
        response.data?.output?.[0]?.content?.[0]?.text ||
        response.data?.choices?.[0]?.message?.content ||
        response.data;
      if (responseText && typeof responseText === "string") {
        const cleanText = responseText.replace(/```(?:json)?\n?/g, "").trim();
        parsedProduct = JSON.parse(cleanText);
        if (parsedProduct) parsedProduct.storeId = storeId;
      }
    } catch (parseError) {
      console.warn(`Parse error for ${imageItem.src}:`, parseError);
    }

    return {
      success: true,
      imageUrl: imageItem.src,
      result: response.data,
      parsedProduct,
    };
  } catch (error) {
    return {
      success: false,
      imageUrl: imageItem.src,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
