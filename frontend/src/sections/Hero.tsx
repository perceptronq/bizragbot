import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useState } from "react";
import axios from 'axios'

interface HeroProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export const Hero = ({
  title = "Welcome to Bizrag Bot!",
  description = "Revolutionizing Customer Interactions with Intelligent AI",
  placeholder = "Send a message",
  buttonText = "Send",
}: HeroProps) => {

  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/', inputValue, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      const data = response.data;
      // Update the state with the response from the backend API
      setInputValue('');
      // Display the response message
      setResponseMessage(data.text);
      console.log({responseMessage});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex-1">
      <section className="w-full py-8 md:py-20 lg:py-28 xl:py-40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {title}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                {description}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              <Input
                className="max-w-lg flex-1 text-black border-gray-800"
                placeholder={placeholder}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button>{buttonText}</Button>
            </form>
            {responseMessage && (
              <p className="text-lg text-gray-400 mt-4">
                {responseMessage}
              </p>
            )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};