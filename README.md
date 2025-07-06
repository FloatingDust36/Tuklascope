# Tuklascope 🔭

**Tuklascope** is an AI-powered mobile application designed to spark curiosity and encourage continuous learning among Filipino youth, with a strong focus on STEM education. Developed for the "Can You HackIT: The IBPAP Challenge!", this app transforms the user's environment into an interactive science museum.

## ✨ Core Features

* **AI Object Recognition:** Instantly identifies objects using the device's camera.
* **"Observe, Understand, Create" Learning Cards:** A unique, AI-generated, three-part learning journey for every object.
* **Conversational AI:** A "Bakit? (Why?)" button allows for deeper exploration of scientific concepts.
* **Personalized Field Journal:** Automatically saves all discoveries, creating a personal log of the user's learning journey.
* **Tiered for All Ages:** AI responses adapt to the user's selected knowledge level (e.g., "Batang Kuryoso," "High School Explorer").
* **Tuklas-Connect Career Hub:** An interactive portal that connects user discoveries to real-world career paths in the Philippine IT-BPM industry.

## 🚀 Getting Started

### Prerequisites

* Node.js and npm installed.
* [Expo Go](https://expo.dev/go) app installed on your Android or iOS phone.
* A personal Google Gemini API Key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [Your GitHub Repository URL Here]
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd Tuklascope
    ```

3.  **Install all dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your Environment Variables:**
    * Create a new file in the root of the project named `.env`.
    * Add your personal Gemini API key to this file:
        ```
        GEMINI_API_KEY="YOUR_PERSONAL_GEMINI_API_KEY_HERE"
        ```

5.  **Run the Application:**
    * Start the Expo development server:
        ```bash
        npx expo start -c
        ```
    * Scan the QR code that appears in the terminal with the Expo Go app on your phone.