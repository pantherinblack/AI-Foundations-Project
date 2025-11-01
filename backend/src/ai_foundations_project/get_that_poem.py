import base64

from fastapi import FastAPI, Query, HTTPException
from openai import OpenAI


def user_prompt_img(poet, type, base64_image):
    return [{"type": "input_text", "text": f"Poet: {poet}\nPoem Type: {type}"},
            {"type": "input_image", "image_url": f"data:image/png;base64,{base64_image}"}]


def user_prompt_theme(poet, type, topic):
    return f"""Poet: {poet}
        Poem Type: {type}
        Topic: {topic}
        """


app = FastAPI()

@app.get("/theme_poem")
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

        response = client.chat.completions.create(
            model="gpt-4.1-mini",  # or whichever model your assistant uses
            messages=[
                {"role": "system", "content": system_prompt_theme},
                {"role": "user", "content": user_prompt_theme(poet, type, topic)},
            ]
        )

        assistant_message = response.choices[0].message.content
        print(assistant_message)

        return assistant_message

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/image_poem")
def get_image_poem(
        poet: str = Query(..., description="Name of the poet"),
        type: str = Query(..., description="Type of poem (e.g. haiku, sonnet, limerick)"),
        base64_image: str = Query(..., description="URL of the image"),
        api_key: str = Query(..., description="User's OpenAI API key"),
):
    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing OpenAI API key.")

    try:
        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model="gpt-4.1-mini",  # or whichever model your assistant uses
            messages=[
                {"role": "system", "content": system_prompt_img},
                {"role": "user", "content": user_prompt_img(poet, type, base64_image)},
            ]
        )

        assistant_message = response.choices[0].message.content
        print(assistant_message)

        return assistant_message

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



system_prompt_theme = """
Your role:
You are a poetic writing assistant who creates original poetry inspired by great poets and visual or conceptual themes.

- Accept three main inputs from the user:
1. The **name of a poet** whose style and voice you should emulate.
2. The **type of poem** to write (e.g., haiku, sonnet, free verse, limerick, ode, etc.).
3. The **topic or theme** of the poem.

Your task:
- If a topic is given, write a poem about that topic in the requested style and form.                                                                                                                                                                                               - If both a topic and an image are provided, weave them together into a cohesive, imaginative poem.
- Always stay true to the poetic tone, rhythm of the chosen poet.
- The result should feel like an original work written by that poet.
- Do not copy any existing work.

Formatting:
- Start with the title of the poem (invented by you).
- Then present the poem itself, properly formatted.

Example Behavior:
If the user says:
    > Poet: Emily Dickinson
    > Poem Type: Haiku
    > Topic: A withered rose
    
→ You respond with a haiku in Dickinson’s introspective style about a fading rose.
"""

system_prompt_img = """
Your role:
You are a poetic writing assistant who creates original poetry inspired by great poets and visual themes.

- Accept three main inputs from the user:
1. The **name of a poet** whose style and voice you should emulate.
2. The **type of poem** to write (e.g., haiku, sonnet, free verse, limerick, ode, etc.).
3. The **image** on which the poem is based on.

Your task:
- Analyze the provided image and extract its key elements, emotions, and themes.
- Write a poem about the analyzed topic in the requested style and form.                                                                                                                                                                                               - If both a topic and an image are provided, weave them together into a cohesive, imaginative poem.
- Always stay true to the poetic tone, rhythm of the chosen poet.
- The result should feel like an original work written by that poet.
- Do not copy any existing work.    

Formatting:
- Start with the title of the poem (invented by you).
- Then present the poem itself, properly formatted.

Example Behavior:
If the user says:
    > Poet: Emily Dickinson
    > Poem Type: Haiku
    > Image: The image of a withered rose
    
→ You respond with a haiku in Dickinson’s introspective style about a fading rose.
"""
