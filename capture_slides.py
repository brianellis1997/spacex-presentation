#!/usr/bin/env python3
"""
Capture slides as images for PowerPoint import
Requires: pip install selenium pillow

Usage: python capture_slides.py
"""

import time
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from PIL import Image

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--start-fullscreen")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

# Number of slides in your presentation
NUM_SLIDES = 16

def capture_slides():
    """Capture all slides as PNG images"""
    
    # Create output directory
    os.makedirs("slide_images", exist_ok=True)
    
    # Start Chrome
    print("Starting Chrome browser...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Load presentation
        print("Loading presentation...")
        driver.get("http://localhost:8888/index.html")
        time.sleep(3)  # Wait for presentation to load
        
        # Set window size for consistent captures
        driver.set_window_size(1920, 1080)
        
        # Capture each slide
        for i in range(NUM_SLIDES):
            print(f"Capturing slide {i+1}/{NUM_SLIDES}...")
            
            # Take screenshot
            screenshot_path = f"slide_images/slide_{i+1:02d}.png"
            driver.save_screenshot(screenshot_path)
            
            # Optional: Crop to remove browser UI if needed
            # img = Image.open(screenshot_path)
            # img_cropped = img.crop((0, 100, 1920, 980))  # Adjust as needed
            # img_cropped.save(screenshot_path)
            
            # Navigate to next slide
            if i < NUM_SLIDES - 1:
                driver.find_element_by_tag_name('body').send_keys(Keys.ARROW_RIGHT)
                time.sleep(1)  # Wait for slide transition
                
                # Wait for fragments to appear
                for j in range(3):  # Assuming max 3 fragments per slide
                    driver.find_element_by_tag_name('body').send_keys(Keys.ARROW_RIGHT)
                    time.sleep(0.5)
        
        print(f"✅ Successfully captured {NUM_SLIDES} slides!")
        print("Images saved in: slide_images/")
        
    finally:
        driver.quit()

def create_powerpoint_instructions():
    """Create instructions for importing to PowerPoint"""
    
    instructions = """
# Converting to PowerPoint

1. Open PowerPoint
2. Create a new blank presentation
3. For each slide image:
   - Insert → Pictures → From File
   - Select slide_XX.png
   - Right-click image → Send to Back
   - Resize to fill entire slide
   
4. Add speaker notes with technical details from the original presentation

5. Save as: Brian_Ellis_SpaceX_AI_Presentation.pptx

## Alternative: Batch Import
1. Insert → Photo Album → New Photo Album
2. File/Disk → Select all slide images
3. Picture Layout: Fit to Slide
4. Create

Then adjust formatting as needed.
"""
    
    with open("slide_images/powerpoint_instructions.md", "w") as f:
        f.write(instructions)
    
    print("📝 PowerPoint import instructions saved!")

if __name__ == "__main__":
    capture_slides()
    create_powerpoint_instructions()