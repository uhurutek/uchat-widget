function uChatWidget (config) {
  const faScript = document.createElement('script');
  faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
  document.head.appendChild(faScript);

  // Create chat widget container
  const chatWidgetContainer = document.createElement('div');
  chatWidgetContainer.id = 'chat-widget-container';
  document.body.appendChild(chatWidgetContainer);

  chatWidgetContainer.innerHTML = `
    <!-- Chat Bubble -->
    <div id="chat-bubble" class="bot-w-16 bot-h-16 bot-bg-gray-800 bot-rounded-full bot-flex bot-items-center bot-justify-center bot-cursor-pointer bot-text-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="bot-w-10 bot-h-10 bot-text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>

    <!-- Chat Popup -->
    <div id="chat-popup" class="bot-hidden bot-absolute bot-bottom-20 bot-right-0 bot-w-96 bot-bg-white bot-rounded-md bot-shadow-md bot-flex bot-flex-col bot-transition-all bot-text-sm">
      <div id="chat-header" class="bot-flex bot-justify-between bot-items-center bot-px-4 bot-bg-gray-200 bot-text-white bot-rounded-t-md">
        <h3 class="m-0 text-lg">${config.HEADER}</h3>
        <button id="close-popup" class="bot-bg-transparent bot-border-none bot-text-white cursor-pointer">
          <i class="far fa-window-close"></i>
        </button>
      </div>
      <div id="chat-messages" class="bot-flex-1 bot-p-4 bot-overflow-y-auto"></div>
      <div id="chat-input-container" class="bot-p-4 bot-border-t bot-border-gray-200">
        <div class="bot-flex bot-space-x-4 bot-items-center">
          <input type="text" id="chat-input" style="border: 1px solid #9f4923;" class="bot-flex-1 bot-rounded-md bot-px-4 bot-py-2 bot-outline-none w-3/4" placeholder="Type your message...">
          <button id="chat-submit" style="margin-left: 3px; bot-border: 1px solid #9f4923;" class="rounded bot-px-4 bot-py-2 cursor-pointer">
          <i class="fas fa-paper-plane" style="color: #9f4923;"></i>
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
  const chatInput = document.getElementById('chat-input');
  const chatSubmit = document.getElementById('chat-submit');
  const chatMessages = document.getElementById('chat-messages');
  const chatBubble = document.getElementById('chat-bubble');
  const chatPopup = document.getElementById('chat-popup');
  const closePopup = document.getElementById('close-popup');

  chatSubmit.addEventListener('click', function () {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';

    onUserRequest(message);
  });

  chatInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      chatSubmit.click();
    }
  });

  chatBubble.addEventListener('click', function () {
    togglePopup();
  });

  closePopup.addEventListener('click', function () {
    togglePopup();
  });
  function togglePopup() {
    const chatPopup = document.getElementById('chat-popup');
    chatPopup.classList.toggle('bot-hidden');
    if (!chatPopup.classList.contains('bot-hidden')) {
      document.getElementById('chat-input').focus();
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
    // Display user message
    const messageElement = document.createElement('div');
    messageElement.className = 'bot-flex bot-justify-end bot-mb-3';
    messageElement.innerHTML = `
      <div class="bot-bg-gray-800 bot-text-white bot-rounded-lg bot-py-2 bot-px-4 bot-max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = '';
    fetchBotResponse(message)
  }

  function fetchBotResponse(message) {
    if(!config.BP_API_ENDPOINT) {
      console.warn('BP_API_ENDPOINT is not defined');
      return;
    }
    fetch(config.BP_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'text',
        text: message
      })
    })
      .then(response => response.json())
      .then(data => {
        decisionFileTypes(data.responses)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  //! TODO File type need to be define high level
  function decisionFileTypes(responses) {
    responses.forEach(response => {
      if (response.type === 'text') {
        replyText(response.text);
      } else if (response.type === 'file') {
        replyFile(response);
      } else if (response.type === 'video') {
        replyVideo(response);
      } else if (response.type === 'card') {
        replyCard(response);
      } else if (response.type === "carousel") {
        replayCarousel(response)
      } else if (response.type === "audio") {
        replyAudio(response)
      }
      else {
        replyText('Sorry, I did not understand your request. Please try again.');
      }
    });
  }

  function replyText(message) {
    // Convert new line to <br>
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
    // Display bot message
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'bot-flex bot-mb-3';
    replyElement.innerHTML = `
      <div style="border: 1px solid #9f4923;" class=" bot-text-black bot-rounded-lg bot-px-4 bot-py-2 bot-max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Reply file response
  function replyFile(file) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'bot-flex bot-mb-3';
    replyElement.innerHTML = `
      <div style="border: 1px solid #9f4923;" class=" bot-text-black bot-rounded-lg bot-py-2 bot-px-4 bot-max-w-[70%]"> 
        <a href="${file.file}" target="_blank">${file.title}</a>
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function replyVideo(video) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'bot-flex bot-mb-3';
    replyElement.innerHTML = `
      <div style="border: 1px solid #9f4923;" class=" bot-text-black bot-rounded-lg bot-py-2 bot-px-2 bot-max-w-[70%]"> 
        <video width="320" height="240" controls>
          <source src="${video.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function replyCard(cards) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'bot-flex bot-mb-3';

    const actions = cards.actions.map(response => `<a href="${response.url}" target="_blank">${response.title}</a>`).join('');

    replyElement.innerHTML = `
        <div class="bot-card">
            <h6>${cards.title}</h6>
            <p>${cards.subtitle}</p>
            <img src="${cards.image}" alt="Image">
            <div class="bot-actions">
                ${actions}
            </div>
        </div>
    `;

    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function replyAudio(audio) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'bot-flex bot-mb-3';
    replyElement.innerHTML = `
      <div style="border: 1px solid #9f4923;" class=" bot-text-black bot-rounded-lg bot-py-2 bot-px-2 bot-max-w-[70%]"> 
        <audio controls>
          <source src="${audio.audio}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function replayCarousel(carousels) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'bot-flex bot-mb-3';
    // Create a variable to keep track of the current card index
    let currentCardIndex = 0;
    function showCard(index) {
      const cards = carousels.items[index];
      const actions = cards.actions.map(response => `<a href="${response.url}" target="_blank">${response.title}</a>`).join('');

      replyElement.innerHTML = `
            <div class="bot-carousel">
                <div class="bot-carousel-container">
                    <div class="bot-card">
                        <h6>${cards.title}</h6>
                        <p>${cards.subtitle}</p>
                        <img src="${cards.image}" alt="Image">
                        <div class="bot-actions">
                            ${actions}
                        </div>
                    </div>
                </div>
                <button class="bot-prev">&#10094;</button>
                <button class="bot-next">&#10095;</button>
            </div>
        `;
    }

    function showNextCard() {
      currentCardIndex = (currentCardIndex + 1) % carousels.items.length;
      showCard(currentCardIndex);
    }

    function showPreviousCard() {
      currentCardIndex = (currentCardIndex - 1 + carousels.items.length) % carousels.items.length;
      showCard(currentCardIndex);
    }

    replyElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('bot-next')) {
        showNextCard();
      } else if (event.target.classList.contains('bot-prev')) {
        showPreviousCard();
      }
    });

    // Show the initial card
    showCard(currentCardIndex);
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}