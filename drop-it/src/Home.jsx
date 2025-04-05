import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './AwardsSection.css';

const   Home = () => {
  
  const sectionRef = useRef(null);
  const threeContainerRef = useRef(null);
  
  // Initialize Three.js scene and boxes
  useEffect(() => {
    if (!threeContainerRef.current) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.domElement);
    
    // Create six boxes with different colors
    const boxes = [];
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Create and position the boxes
    for (let i = 0; i < 6; i++) {
      const material = new THREE.MeshBasicMaterial({ color: colors[i] });
      const box = new THREE.Mesh(geometry, material);
      box.position.x = (i % 3) * 2.5 - 2.5;
      box.position.y = Math.floor(i / 3) * -2.5 + 1.25;
      box.position.z = -5;
      box.rotation.x = 0.5;
      box.rotation.y = 0.5;
      box.visible = false; // Hide initially
      scene.add(box);
      boxes.push(box);
    }
    
    camera.position.z = 5;
    
    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate all boxes
      boxes.forEach(box => {
        if (box.visible) {
          box.rotation.x += 0.01;
          box.rotation.y += 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Create ScrollTrigger for Three.js boxes
    let boxesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".boxes-section",
        start: "top center",
        end: "bottom center",
        scrub: true,
        markers: false
      }
    });
    
    // Make boxes visible one by one
    boxes.forEach((box, index) => {
      boxesTimeline.add(() => {
        box.visible = true;
      }, index * 0.1);
    });
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      threeContainerRef.current?.removeChild(renderer.domElement);
      boxes.forEach(box => {
        scene.remove(box);
        geometry.dispose();
        box.material.dispose();
      });
    };
  }, []);
  
  // Generate random positions for images
  useEffect(() => {
    const images = document.querySelectorAll('.scaleableImg');
    
    // Set random positions for each image
    images.forEach(img => {
      // Generate random positions within viewport
      const randomTop = Math.random() * 10; // 0-80% from top
      const randomLeft = Math.random() * 80; // 0-80% from left
      
      // Apply random positions with GSAP
      gsap.set(img, {
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
        // Add some random rotation for visual interest
        rotation: Math.random() * 20 - 10
      });
    });
  }, []);
  
  // Main GSAP animations
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Create the timeline animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".imageBoard",
        pin: true,
        start: "top top",
        end: "+=300%",
        scrub: 1,
      },
      defaults: {
        ease: "none",
      },
    });
    
    // Add all the animations
    tl.to(
      document.body,
      {
        delay: 0.3,
        backgroundColor: "#f0f0f0",
      },
      "start"
    )
    .to(
      ".upper-container h1",
      {
        scale: 5,
      },
      "start"
    )
    .to(
      ".upper-container h1",
      {
        opacity: 0,
      },
      "start"
    )
    .to(
      "#scaleableImg1",
      {
        scale: 10,
        x: -1500,
      },
      "start"
    )
    .to(
      "#scaleableImg2",
      {
        scale: 10,
        x: -2500,
      },
      "start"
    )
    .to(
      "#scaleableImg3",
      {
        scale: 10,
        x: -2000,
      },
      "start"
    )
    .to(
      "#scaleableImg4",
      {
        scale: 10,
        x: 3000,
      },
      "start"
    )
    .to(
      "#scaleableImg5",
      {
        scale: 10,
        x: 2000,
      },
      "start"
    )
    .to(
      ".cardImage",
      {
        delay: 0.1,
        scale: 5,
      },
      "start"
    )
    .to(
      ".cardImage",
      {
        delay: 0.4,
        opacity: 1,
      },
      "start"
    )
    .to(".scaleableImg", {
      opacity: 0,
    });
    
    // Big text rotation animation
    const bigTextTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".big-text-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });
    
    bigTextTimeline.to(".big-text", {
      rotation: 180,
      duration: 1
    });
    
    // Sign-in button animation
    const signInTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".sign-in-section",
        start: "top bottom",
        end: "center center",
        scrub: true,
      }
    });
    
    signInTimeline.fromTo(".sign-in-button", {
      y: 100,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 1
    });

    // Cleanup function to kill ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []); 

  return (
    <>
      <div className="upper-container">
        <span >DROP_IT</span>
        <h1>
        Give your gadgets a second life—Recycle today for a greener tomorrow!
        </h1>
      </div>
     
      <div className="big-text-container">
          {/* <h2 className="big-text">JOIN</h2> */}
      </div>
    
      <div className="imageBoard">
      <div className="text-[130px] ml-20 font-bold bg-[#87ff60]">Clean Tomorrow, Starts Today.</div>
  <div className="flex justify-center gap-4 mt-4">
    <img src="/im4.jpg" alt="icon1" className="w-80 h-80" />
    <img src="/im5.jpg" alt="icon2" className="w-80 h-80" />
    <img src="/im1.jpg" alt="icon3" className="w-80 h-80" />
   
    </div>
        <img src="/img1.png" alt="" id="scaleableImg1" className="scaleableImg" />
        <img src="/img2.png" alt="" id="scaleableImg2" className="scaleableImg" />
        <img src="/img3.png" alt="" id="scaleableImg3" className="scaleableImg" />
        <img src="/img4.png" alt="" id="scaleableImg4" className="scaleableImg" />
        <img src="/img5.png" alt="" id="scaleableImg5" className="scaleableImg" />
      </div>
      
      <div className="boxes-section flex flex-col items-center relative">
  <h2 className="text-center text-8xl font-bold">Find Waste Shops Near You</h2>
  <p className="pt-20 text-4xl text-center max-w-3xl">Easily find nearby waste collection centers, contact them directly, and contribute to a cleaner, greener community.</p>
  
  <div className="relative ">
    <img src="/iii.png" alt="icon2" className="w-[900px] relative z-10 mt-10" />
    {/* Second overlapping image - replace with your actual image */}
    <img src="/iii.png" alt="overlapping image" className="w-[900px]  absolute -bottom-4 -right-4 z-20" />
  </div>
</div>
       
<div className="boxes-section flex flex-col items-center relative min-h-screen overflow-hidden">
  {/* Random Images */}
  <img src="/img1.png" alt="Decor 1" className="absolute top-0 left-20 w-62 h-52 object-cover rounded-xl" />
  <img src="/img2.png" alt="Decor 2" className="absolute top-30 right-50 w-32 h-32 object-cover rounded-xl" />
  <img src="/img3.png" alt="Decor 3" className="absolute bottom-239 left-80 w-32 h-32 object-cover rounded-xl" />
  <img src="/img4.png" alt="Decor 4" className="absolute bottom-209 right-30 w-32 h-32 object-cover rounded-xl" />
  <img src="/img5.png" alt="Decor 5" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 object-cover rounded-xl opacity-20" />

  {/* Title */}
  <h2 className="text-center text-8xl font-bold z-10">EXPLORE OUR WORK</h2>

  {/* Paragraph */}
  <p className="pt-20 text-4xl text-center max-w-3xl z-10">
  Our smart platform uses your location to list nearby waste centers and even recommends the right type of shop based on your waste. Whether it’s old electronics, plastic, or hazardous items — we've got the right place for it.
  Together, let’s make responsible disposal easy and accessible.
  </p>
  <div className="sign-in-section">
        <button className="sign-in-button">SIGN IN</button>
      </div>
  
</div>

    </>
  );
};

export default Home;