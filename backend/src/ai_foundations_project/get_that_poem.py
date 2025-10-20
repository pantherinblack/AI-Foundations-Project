from fastapi import FastAPI, Query, HTTPException
from openai import OpenAI

app = FastAPI()

@app.get("/poem")
def get_poem(
    poet: str = Query(..., description="Name of the poet"),
    type: str = Query(..., description="Type of poem (e.g. haiku, sonnet, limerick)"),
    topic: str = Query(..., description="Topic of the poem"),
    api_key: str = Query(..., description="User's OpenAI API key"),
):
    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing OpenAI API key.")

    try:
        client = OpenAI(api_key=api_key)

        system_prompt = "You are a poetic assistant that writes original poems in requested styles. Always emulate the requested poet's tone and structure."
        user_prompt = f"Write a {type} about '{topic}' in the style of {poet}. Make sure the poem clearly reflects {poet}'s voice, imagery, and rhythm."

        response = client.chat.completions.create(
            model="gpt-4.1-mini",  # or whichever model your assistant uses
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]
        )

        assistant_message = response.choices[0].message.content
        print(assistant_message)

        return assistant_message

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))