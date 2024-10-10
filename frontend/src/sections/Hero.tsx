import Button from "@/components/Button";
import Input from "@/components/Input";

interface HeroProps {
    title?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
}

const Hero = ({
    title = "Welcome to Bizrag Bot!",
    description = "Revolutionizing Customer Interactions with Intelligent AI",
    placeholder = "Send a message",
    buttonText = "Send",
}: HeroProps) => {
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
                            <form className="flex space-x-2">
                                <Input
                                    className="max-w-lg flex-1 bg-black text-white border-gray-800"
                                    placeholder={placeholder}
                                    type="text"
                                />
                                <Button variant="blue" type="submit">{buttonText}</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Hero;
