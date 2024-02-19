async function uChatWidget(config) {
  if (!config.BASE_COLOR) {
    config.BASE_COLOR = "#9f4923"
  }
  let threadId;
  let loading;
  const style = document.createElement("style");
  style.innerHTML = `
  .bot-w-16 {
      width: 3.2rem; 
  }
  .bot-h-16 {
      height: 3.2rem; 
  }
  .bot-rounded-full {
      border-radius: 9999px; 
  }
  .bot-justify-center {
      justify-content: center;
  }
  .bot-cursor-pointer {
      cursor: pointer; 
  }
  .bot-text-3xl {
      font-size: 1.875rem;
  }  
  #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      flex-direction: column;
  }
  #chat-popup {
      height: 70vh;
      max-height: 70vh;
      transition: all 0.3s;
      overflow: hidden;
  }
  #minimize-button{
      display: none;
  }
  @media (max-width: 768px) {
      #chat-popup {
      position: fixed;
      top: 10;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 90%;
      max-height: 90%;
      border-radius: 0;
      }
      #minimize-button{
      display: block;
      }
  }
  .bot-w-10 {
      width: 1.875rem; 
  }
  .bot-h-10 {
      height: 1.875rem; 
  }  
  .bot-w-8 {
      width: 1.2rem; 
  }
  .bot-h-8 {
      height: 1.2rem; 
  } 
  .bot-absolute {
      position: absolute; 
  }
  .bot-right-0 {
      right: 0; 
  }
  .bot-w-96 {
      width: 24rem; 
  }
  .bot-flex-col {
      flex-direction: column;
  }
  .bot-transition-all {
      transition-property: all; 
  }
  .bot-text-sm {
      font-size: 0.875rem; 
  }
  .bot-bottom-20 {
      bottom: 4rem;
  }
  .bot-bg-white {
      background-color: #ffffff; 
  }
  .bot-shadow-md {
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
  }
  .bot-flex-col {
      flex-direction: column; 
  }
  .bot-justify-between {
      justify-content: space-between; 
  }
  .bot-items-center {
      align-items: center; 
  }
  .bot-p-4 {
      padding: 1rem; 
  }
  .bot-rounded-t-md {
      border-top-left-radius: 0.375rem; 
      border-top-right-radius: 0.375rem;
      border: 1.5px solid ${config.BASE_COLOR};
  }
  .bot-bg-transparent {
      background-color: white; 
  }
  .bot-border-none {
      border: none; 
  }
  .bot-flex-1 {
      flex: 1; 
  }
  .bot-border {
      border-width: 1px; 
  }
  .bot-border-gray-300 {
      border-color: ${config.BASE_COLOR}; 
  }
  .bot-outline-none {
      outline: none; 
  }
  .bot-overflow-y-auto {
      overflow-y: auto; 
  }
  .bot-border-t {
      border-top-width: 1px; 
      border-color: ${config.BASE_COLOR}; 
  }
  .bot-border-gray-200 {
      border-color: ${config.BASE_COLOR}; 
  }
  .bot-hidden {
      visibility: hidden;
  }
  .bot-space-x-4 {
      margin-right: 1rem; 
  }
  .bot-text-center {
      text-align: center; 
  }
  .bot-text-xs {
      font-size: 0.75rem; 
  }
  .bot-pt-4 {
      padding-top: 1rem; 
  }
  .bot-rounded-md {
      border-radius: 0.375rem; 
  }
  .bot-py-2 {
      padding-top: 0.5rem; 
      padding-bottom: 0.5rem;
  }
  .bot-bg-gray-200 {
      background-color: ${config.BASE_COLOR}; 
      border: 1px solid ${config.BASE_COLOR} !important;
  }
  
  .bot-text-black {
      color: #000000; 
  }
  .bot-rounded-lg {
      border-radius: 0.5rem; 
  }
  .bot-rounded-right {
    border-radius: 0.5rem 0.5rem 0.0rem 0.5rem ; 
  }
  .bot-rounded-left {
    border-radius: 0.5rem 0.5rem 0.5rem 0.0rem ; 
  }
  .bot-px-4 {
      padding-left: 1rem; 
      padding-right: 1rem;
  }
  .bot-px-2 {
      padding-left: 0.5rem; 
      padding-right: 0.5rem;
  }
  .bot-max-w-[70%] {
      max-width: 70%; 
  }
  .bot-bg-gray-800 {
      background-color: ${config.BASE_COLOR}; 
  }
  .bot-text-white {
      color: #ffffff; 
  }
  .bot-flex {
      display: flex; 
  }
  .bot-justify-end {
      justify-content: flex-end; 
  }
  .bot-mb-3 {
      margin-bottom: 0.75rem; 
  }
  a {
      text-decoration: none;
  }
  :root {
    --animationTime: 0.8s;
    --dotSize: 10px;
  }

  .bot-loader {
    text-align: left;
  }

  .bot-loader span {
    display: inline-block;
    vertical-align: middle;
    width: var(--dotSize);
    height: var(--dotSize);
    background: black;
    border-radius: var(--dotSize);
    animation: loader var(--animationTime) infinite alternate;
  }

  .bot-loader span:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  .bot-loader span:nth-of-type(3) {
    animation-delay: 0.6s;
  }

  @keyframes loader {
    0% {
      opacity: 0.9;
      transform: scale(0.5);
    }
    100% {
      opacity: 0.1;
      transform: scale(1);
    }
  }
  
`;
  document.head.appendChild(style);
  const faScript = document.createElement("script");
  faScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js";
  document.head.appendChild(faScript);

  // Create chat widget container
  const chatWidgetContainer = document.createElement("div");
  chatWidgetContainer.id = "chat-widget-container";
  document.body.appendChild(chatWidgetContainer);
  chatWidgetContainer.innerHTML = `
    <!-- Chat Bubble -->
    <div id="chat-bubble" class="bot-w-16 bot-h-16 bot-bg-gray-800 bot-rounded-full bot-flex bot-items-center bot-justify-center bot-cursor-pointer bot-text-3xl">
<svg id="cross-icon" xmlns="http://www.w3.org/2000/svg" class="bot-w-10 bot-h-10 bot-text-white" fill="none" viewBox="0 0 384 512" stroke="currentColor" stroke-width="2">
      <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
  </svg>
     <svg id="msg-icon" xmlns="http://www.w3.org/2000/svg" class="bot-w-10 bot-h-10 bot-text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </div>
    

    <!-- Chat Popup -->
    <div id="chat-popup" class="bot-hidden bot-absolute bot-bottom-20 bot-right-0 bot-w-96 bot-bg-white bot-rounded-md bot-shadow-md bot-flex bot-flex-col bot-transition-all bot-text-sm">
    <div id="chat-header" class="bot-flex bot-items-center bot-px-4 bot-bg-gray-200 bot-text-white bot-rounded-t-md">
    <div class="bot-flex bot-items-center bot-flex-1">
    ${config.AVATAR ?
      `<img src="${config.AVATAR}" width="30" style="border-radius: 50%; margin-right: 10px;"/>`
      :
      ` <div id="chat-bubble" style="width: 30px; height: 30px; background-color:white; margin-right: 10px;" class=" bot-rounded-full bot-flex bot-items-center bot-justify-center bot-cursor-pointer bot-text-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path fill="#9f4923" d="M32 32c17.7 0 32 14.3 32 32V288c0 70.7 57.3 128 128 128s128-57.3 128-128V64c0-17.7 14.3-32 32-32s32 14.3 32 32V288c0 106-86 192-192 192S0 394 0 288V64C0 46.3 14.3 32 32 32z"/></svg>
      </div>
      
          `
    }
        <h5 >${config.APP_NAME}</h5>
    </div>
    <div id="minimize-button" >  <svg id="cross-icon" xmlns="http://www.w3.org/2000/svg" class="bot-w-8 bot-h-8 bot-text-white" fill="none" viewBox="0 0 384 512" stroke="currentColor" stroke-width="2">
    <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
</svg></div>
</div>
      <div id="chat-messages" class="bot-flex-1 bot-p-4 bot-overflow-y-auto"></div>
      <div id="chat-input-container" class="bot-p-4 bot-border-t bot-border-gray-200">
        <div class="bot-flex bot-space-x-4 bot-items-center">
          <input type="text" id="chat-input" style="border: 1px solid ${config.BASE_COLOR};" class="bot-flex-1 bot-rounded-md bot-px-4 bot-py-2 bot-outline-none w-3/4" placeholder="Type your message...">
          <button id="chat-submit" style="margin-left: 3px; border: 1px solid ${config.BASE_COLOR};" class="bot-rounded-md  bot-px-4 bot-py-2 cursor-pointer">
          <i class="fas fa-paper-plane" style="color: ${config.BASE_COLOR};"></i>
        </button>
        
        </div>
        <div class="bot-flex bot-text-center bot-justify-center bot-pt-4">
          
          <div ><span>Powered by</span> &nbsp;
          </div>
          <div>
          <img src="https://uhurutek.com/assets/img/uhurutek_logo.svg" width="80" alt="Uhurutek" style="cursor: pointer;" onclick="window.open('https://uhurutek.com', '_blank');">
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const chatInput = document.getElementById("chat-input");
  const chatSubmit = document.getElementById("chat-submit");
  const chatMessages = document.getElementById("chat-messages");
  const chatBubble = document.getElementById("chat-bubble");
  const chatPopup = document.getElementById("chat-popup");
  const messageIcon = document.getElementById("msg-icon");
  const crossIcon = document.getElementById("cross-icon");
  const minimizeButton = document.getElementById("minimize-button");
  chatSubmit.addEventListener("click", function (event) {

    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";

    onUserRequest(message);
    event.preventDefault();
  });

  chatInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      chatSubmit.click();
    }
  });
  minimizeButton.addEventListener("click", function () {
    togglePopup();
  })
  chatBubble.addEventListener("click", function () {
    togglePopup();
  });
  messageIcon.style.display = "block";
  crossIcon.style.display = "none"
  function togglePopup() {
    const chatPopup = document.getElementById("chat-popup");
    chatPopup.classList.toggle("bot-hidden");
    if (!chatPopup.classList.contains("bot-hidden")) {
      setTimeout(() => {
        if (chatInput) {
          chatInput.focus();
        }
      }, 50);
      messageIcon.style.display = "none";
      crossIcon.style.display = "block";
    } else {
      messageIcon.style.display = "block";
      crossIcon.style.display = "none";
    }

  }

  /* click outside close popup */

  // document.addEventListener('click', function (event) {
  //   const chatPopup = document.getElementById('chat-popup');
  //   const chatBubble = document.getElementById('chat-bubble');

  //   if (!chatPopup.contains(event.target) && !chatBubble.contains(event.target)) {
  //     if (!chatPopup.classList.contains('bot-hidden')) {
  //       chatPopup.classList.add('bot-hidden');
  //     }
  //   }
  // });

  function onUserRequest(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "bot-flex bot-justify-end bot-mb-3";
    messageElement.innerHTML = `
      <div class="bot-bg-gray-800 bot-text-white bot-rounded-right bot-py-2 bot-px-4 bot-max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";
    loading = true;
    messageLoading();
    fetchBotResponse(message);
  }

  async function fetchBotResponse(message) {
    if (!config.UHURUCHAT_ENDPOINT) {
      console.warn("UHURUCHAT_ENDPOINT is not defined");
      return;
    }
    if (!threadId) threadId = await initiatedChat();
    await conversation(threadId, message)
  }

  async function initiatedChat() {
    try {
      const response = await fetch(`${config.UHURUCHAT_ENDPOINT}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const threadId = data.id;
      return threadId;
    } catch (error) {
      console.error("Error:", error);
      loading = false;
      messageLoading()
      replyText("Something went wrong. Please try again later")
      throw error;
    }
  }


  async function conversation(threadId, message) {
    try {
      const response = await fetch(`${config.UHURUCHAT_ENDPOINT}/chats/${config.ASSISTANT_ID}/${threadId}/${message}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      loading = false;
      messageLoading()
      replyText(data)
    } catch (error) {
      console.error("Error:", error);
      loading = false;
      messageLoading()
      replyText("Something went wrong. Please try again later")
      throw error;
    }
  }



  function replyText(message) {
    const chatMessages = document.getElementById("chat-messages");
    const replyElement = document.createElement("div");
    replyElement.className = "bot-flex bot-mb-3";
    replyElement.innerHTML = `
      <div style="display: flex; align-items: center;">
     ${config.AVATAR ? `
     <img src="${config.AVATAR}" width="18px" height="18px" style="margin-right: 4px;">` : ` <svg xmlns="http://www.w3.org/2000/svg" style="padding-right: 5px" height="16" width="12" viewBox="0 0 384 512"><path fill="#9f4923" d="M32 32c17.7 0 32 14.3 32 32V288c0 70.7 57.3 128 128 128s128-57.3 128-128V64c0-17.7 14.3-32 32-32s32 14.3 32 32V288c0 106-86 192-192 192S0 394 0 288V64C0 46.3 14.3 32 32 32z"/></svg>
     `
      }
      <div id="replay" style="border: 1px solid ${config.BASE_COLOR};" class="bot-text-black bot-rounded-left bot-px-4 bot-py-2 bot-max-w-[70%]">
      ${message}
      </div>
      </div>
  
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function messageLoading() {
    if (loading == true) {
      const chatMessages = document.getElementById("chat-messages");
      const replyElement = document.createElement("div");
      replyElement.className = "bot-flex bot-mb-3";
      replyElement.id = "msg-bot-loader"
      replyElement.innerHTML = `
    ${config.AVATAR ? `
     <img src="${config.AVATAR}" width="18px" height="18px" style="margin-right: 4px;">` : ` <svg xmlns="http://www.w3.org/2000/svg" style="padding-right: 5px" height="16" width="12" viewBox="0 0 384 512"><path fill="#9f4923" d="M32 32c17.7 0 32 14.3 32 32V288c0 70.7 57.3 128 128 128s128-57.3 128-128V64c0-17.7 14.3-32 32-32s32 14.3 32 32V288c0 106-86 192-192 192S0 394 0 288V64C0 46.3 14.3 32 32 32z"/></svg>
     `
        }
      <div class='bot-loader'>
    <span></span>
    <span></span>
    <span></span>
    </div>
    `;
      chatMessages.appendChild(replyElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      const loaderElement = document.querySelector('#msg-bot-loader');
      if (loaderElement) {
        loaderElement.parentNode.removeChild(loaderElement);
      }


    }
  }
}
