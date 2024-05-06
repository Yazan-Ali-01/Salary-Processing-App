import React from 'react'
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

const HomePage = () => {
  const [text] = useTypewriter({
    words: [
      'Spend, save and manage money - anytime anywhere',
      'Simplified payroll for your business',
      'Sending money home has never been so easy !',
    ],
    loop: true, // Set to 0 for no loop or true for infinite loop
    typeSpeed: 62,
    deleteSpeed: 25,
    delaySpeed: 2000,
  });

  const imageVariants = {
    hidden: {
      scale: 0.75, // Start at a smaller scale
      y: 30, // Start a bit lower
      opacity: 0 // Start as transparent
    },
    visible: {
      scale: 1, // Scale to normal size
      y: 0, // Move to original y position
      opacity: 1, // Fully visible
      transition: {
        type: 'spring', // Use a spring physics for the motion
        stiffness: 260,
        damping: 20,
        delay: 0.5, // Delay the animation
        duration: 3 // Duration of the animation
      }
    }
  };
  return (
    <div className='min-h-full flex flex-col items-center justify-start'>
      <div className='flex'>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6 inline-block text-transparent bg-clip-text bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,#F72717_0%,#f43f5e_100%)]">
          <span>
            {text}
          </span>
          <Cursor
            cursorBlinking={true}
            cursorStyle='|'
            cursorColor='#ff014f'
          />
        </h2>
      </div>
      <div className='flex items-center justify-center w-full'>
        <div className=' min-h-full w-1/3 flex flex-col justify-start items-start ml-10'>
          <div>
            <h1 className="text-start text-md font-semibold tracking-tight text-primary">
              C3Pay
            </h1>
            <h3 className="text-[300px] font-bold tracking-tight lg:text-[40px] mr-16 text-start">
              A salary card for your hardworking employees
            </h3>
          </div>
        </div>
        <div className='min-h-full w-2/3 justify-center items-center flex'>
          <motion.img
            src="https://edenred.ae/wp-content/uploads/2021/12/0_main.png"
            alt="edenred-payroll"
            className='max-h-[500px]'
            variants={imageVariants} // Use the defined variants
            initial="hidden" // Initial animation state
            animate="visible" // Animate to this state
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage