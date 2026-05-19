from app.config.providers import openai_client, groq_client

OPENAI_DEFAULT_MODEL = "gpt-4.1-mini"

GROQ_FAST_MODEL = "llama-3.3-70b-versatile"


def generate_completion(
    provider: str,
    messages: list,
    model: str | None = None,
    temperature: float = 0,
    response_format=None,
):
    if provider == "openai":
        response = openai_client.chat.completions.create(
            model=model or OPENAI_DEFAULT_MODEL,
            messages=messages,
            temperature=temperature,
            response_format=response_format,
        )

        return response.choices[0].message.content

    elif provider == "groq":
        try:
            response = groq_client.chat.completions.create(
                model=model or GROQ_FAST_MODEL,
                messages=messages,
                temperature=temperature,
            )

            return response.choices[0].message.content
        
        except Exception as e:
            print(f"[groq fallback] {e}")

            response = openai_client.chat.completions.create(
                model=OPENAI_DEFAULT_MODEL,
                messages=messages,
                temperature=temperature,
            )

            return response.choices[0].message.content
    
    raise ValueError(f"Unsupported provider: {provider}")