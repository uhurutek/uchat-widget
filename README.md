# UChat Widget

## Introduction

This repository contains the code for the Uchat-widget that can be easily added to any website. The widget allows users to engage in real-time conversations with a botpress chatbot.

## Getting Started

To add the chat widget to your website, follow these steps:

1. Include the chat-widget style sheet from the CDN in your HTML head tag:

    ```html
    <link rel="stylesheet" href="https://cdn.example.com/chat-widget.css">
    ```

2. Include the chat-widget script from the CDN at the bottom of your HTML body tag:

    ```html
    <script src="https://cdn.example.com/chat-widget.js"></script>
    ```

3. Initialize the chat widget by calling the `initChatWidget` function with the container element ID:

    ```html
    <script>
      window.chatWidget({
        BP_API_ENDPOINT: "https://{botpress-server-url}/api/v1/bots/{botID}/converse/{userID}",
        });
    </script>
    ```

4. Customize the chat widget appearance and behavior by modifying the provided CSS and JavaScript files.

## Customization

The chat widget can be customized to match the look and feel of your website. The provided CSS file can be modified to change the widget's colors, fonts, and layout. The JavaScript file can be extended to add additional functionality or integrate with your existing systems.



## License

This project is licensed under the [MIT License](LICENSE).
