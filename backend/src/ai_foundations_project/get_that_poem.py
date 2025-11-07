import base64
from io import BytesIO

from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from gtts import gTTS


class Item(BaseModel):
    poet: str
    type: str
    topic: str | None = None
    base64_image: str | None = None
    api_key: str


def user_prompt_img(poet, type, base64_image):
    return [{"type": "input_text", "text": f"> Poet: {poet}\n> Poem Type: {type}\n> Image: analyze the given image"},
            {"type": "input_image", "image_url": base64_image}
            ]


def user_prompt_theme(poet, type, topic):
    return f"""> Poet: {poet}
        > Poem Type: {type}
        > Topic: {topic}
        """


app = FastAPI()


@app.post("/poem")
async def get_poem_endpoint(item: Item):
    if not is_valid_input(item.poet, item.type, item.api_key):
        raise HTTPException(status_code=900,
                            detail="Invalid input parameters. Please check poet name, poem type, and topic.")

    if item.base64_image:
        return get_image_poem(
            poet=item.poet,
            type=item.type,
            base64_image=item.base64_image,
            api_key=item.api_key
        )
    else:
        return get_poem(
            poet=item.poet,
            type=item.type,
            topic=item.topic,
            api_key=item.api_key
        )


def is_valid_input(poet, type, api_key):
    try:
        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model="gpt-4o-mini",
            instructions=validate_input,
            input=f"> Poet: {poet}\n> Poem Type: {type}",
            temperature=0.0,
            max_output_tokens=16
        )

        assistant_message = response.output_text.strip().lower()

        if assistant_message == "false":
            return False
        else:
            return True

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

        response = client.responses.create(
            model="gpt-4o",
            instructions=system_prompt_theme,
            input=user_prompt_theme(poet, type, topic)
        )

        assistant_message = response.output_text
        print(assistant_message)

        return {"text": assistant_message, "audio": tts(assistant_message)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

        response = client.responses.create(
            model="gpt-4o",
            instructions=system_prompt_img,
            input=[
                {"role": "user", "content": user_prompt_img(poet, type, base64_image)},
            ]
        )

        assistant_message = response.output_text

        return {"text": assistant_message, "audio": tts(assistant_message)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def tts(assistant_message):
    audio_bytes = BytesIO()
    gTTS(assistant_message).write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    audio_data = audio_bytes.read()
    audio_base64 = base64.b64encode(audio_data).decode('utf-8')
    return audio_base64

validate_input = """
Your role:
You are an export in the field of poetry and poetic forms.

- Accept three main inputs from the user:
1. The **name of a poet**.
2. The **type of poem** (e.g., haiku, sonnet, free verse, limerick, ode, etc.).

Your task:
You have to validate the three inputs provided by the user.
Take into consideration that there may be typographical errors, 
those should not affect the validity of the inputs as long its clear what the user ment.

Validation Criteria:
- The poet's name must correspond to a recognized poet in literary history.
- The type of poem must be a valid poetic form.
- The inputs must consist of valid words.

Output:
- Respond with "true" if all inputs are valid.
- Respond with "false" if any input is invalid.
- Do not provide any additional explanations or information.
"""

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
    > Image: analyze the given image
    The image is given at the end of the prompt.
    
→ You respond with a haiku in Dickinson’s introspective style about a fading rose.
"""



