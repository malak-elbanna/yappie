import image from '../assets/image.png';
import image1 from '../assets/image 6.png';
import image2 from '../assets/image 12.png';

export default function AboutUs() {
    return (
        <div className="bg-gray-900 min-h-screen w-full">
            <div className="w-full h-80 md:h-96 bg-gradient-to-r from-purple-700 to-purple-900 flex flex-col md:flex-row justify-between items-center px-6 md:px-16 relative overflow-hidden">
                <div className="z-10">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
                        ABOUT <span className="text-purple-300">YAPPIE</span>
                    </h1>
                    <p className="text-xl text-purple-100 font-light max-w-2xl">
                        Your audio adventure begins here. Discover stories that move you.
                    </p>
                </div>
                
                <div className="hidden md:flex space-x-8 absolute right-16 bottom-0 transform translate-y-1/4">
                    <img 
                        src={image} 
                        alt="It Ends With Us" 
                        className="w-[204px] h-[125px] object-contain rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300" 
                    />
                    <img 
                        src={image1} 
                        alt="Inside the Political Mind" 
                        className="w-[204px] h-[125px] object-contain rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 mt-8" 
                    />
                    <img 
                        src={image2} 
                        alt="George" 
                        className="w-[204px] h-[125px] object-contain rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300" 
                    />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Listen, Learn, and Explore – <span className="text-purple-400">Your Audio Journey</span> Starts Here!
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Welcome to Yappie, your ultimate destination for audiobooks and podcasts! We are passionate about storytelling and knowledge-sharing, bringing you a diverse collection of audiobooks and podcasts across various genres.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Whether you're looking for best-selling novels, insightful non-fiction, or thought-provoking discussions, our platform offers an immersive audio experience tailored to your interests.
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                At Yappie, we believe in the power of audio to entertain, educate, and inspire. Our user-friendly interface, seamless playback features, and offline listening options ensure you can enjoy your favorite content anytime, anywhere.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Join our community of listeners and explore a world of stories and ideas, all at your fingertips.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-gray-800 p-8 rounded-xl hover:bg-purple-800 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-white mb-4">10,000+ Titles</h3>
                        <p className="text-gray-300">Massive library of audiobooks and podcasts</p>
                    </div>
                    <div className="bg-gray-800 p-8 rounded-xl hover:bg-purple-800 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-white mb-4">Anywhere Access</h3>
                        <p className="text-gray-300">Listen offline or on the go</p>
                    </div>
                    <div className="bg-gray-800 p-8 rounded-xl hover:bg-purple-800 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-white mb-4">Curated Content</h3>
                        <p className="text-gray-300">Handpicked recommendations just for you</p>
                    </div>
                </div>
            </div>
        </div>
    )
}