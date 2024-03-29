import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

const CreatePost = () => {
    const navigate = useNavigate();

    const [Form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    });

    const [generatingImg, setGeneratingImg] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSumbmit = async (e) => {
        e.preventDefault();

        if (Form.prompt && Form.photo) {
            setLoading(true);

            try {
                const response = await fetch('http://localhost:8080/api/v1/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...Form })
                });

                await response.json();
                alert('Success');
                navigate('/');
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please enter a prompt and generate an image')
        }
    };

    const handleChange = (e) => {
        setForm({ ...Form, [e.target.name]: e.target.value })
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(Form.prompt)
        setForm({ ...Form, prompt: randomPrompt });
    };

    const generateImage = async () => {
        if (Form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await fetch('http://localhost:8080/api/v1/dalle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: Form.prompt }),
                });

                const data = await response.json();

                setForm({ ...Form, photo: `data:image/jpeg;base64,${data.photo}` });

            } catch (error) {
                alert(error);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert('Please enter a prompt');
        }
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
                <p className="mt-2 text-[#666e75] text-[14px] max-w[500px]" >Create imaginative and visually stunning images through AI and share them with the commnunity</p>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSumbmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        lableName="Your name"
                        type="text"
                        name="name"
                        placeholder="Riley"
                        value={Form.name}
                        handleChange={handleChange}
                    />
                    <FormField
                        lableName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
                        value={Form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        {Form.photo ? (
                            <img
                                src={Form.photo}
                                alt={Form.prompt}
                                className="w-full h-full object-contain"

                            />
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-9/12 h-9/12 object-contain opacity-40"
                            />
                        )}

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center
                            items-center bg-[#rgba(0,0,0,0.5)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex gap-5">
                    <button
                        type='button'
                        onClick={generateImage}
                        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        {generatingImg ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="mt-10">
                    <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
                    <button
                        type='submit'
                        className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'

                    >
                        {loading ? 'Sharing...' : 'Share with the Community'}
                    </button>

                </div>
            </form>
        </section>
    );
};

export default CreatePost