
console.log("loaded wonderchat.js");

const removeHttp = (url) => {
    if (url === undefined) {
        return "";
    }

    return url.replace(/^https?:\/\//, "");
};

function isCrossOriginFrame(iframe = undefined) {
    try {
        if (iframe !== undefined) {
            return !iframe?.window?.top?.location.hostname;
        }

        return !window?.top?.location.hostname;
    } catch (e) {
        return true;
    }
}

const oldOverflow = document?.body?.style?.overflow ?? "";

const wonderchatScript = document.querySelector(
    "script[data-name='wonderchat']"
);

const offsetBottom = wonderchatScript?.getAttribute(
    "data-widget-offset-bottom"
);
const offsetRight = wonderchatScript?.getAttribute("data-widget-offset-right");

const wonderchatWrapper = document.createElement("div");
wonderchatWrapper.id = "wonderchat-wrapper";
wonderchatWrapper.style.zIndex = "-942999";
wonderchatWrapper.style.background = "transparent";
wonderchatWrapper.style.overflow = "hidden";
wonderchatWrapper.style.position = "fixed";
wonderchatWrapper.style.bottom = "0px";
wonderchatWrapper.style.right = "0px";
wonderchatWrapper.style.width = "80px";
wonderchatWrapper.style.height = "80px";

if (offsetBottom) {
    wonderchatWrapper.style.marginBottom = offsetBottom;
}
if (offsetRight) {
    wonderchatWrapper.style.marginRight = offsetRight;
}

let widgetOpen = true;

document.body.appendChild(wonderchatWrapper);

let wonderchatId = wonderchatScript?.getAttribute("data-id");

const wonderchatAddress = wonderchatScript?.getAttribute("data-address");
const greeting = wonderchatScript?.getAttribute("greeting");
const dataGreeting = wonderchatScript?.getAttribute("data-greeting");
const dataIgnorePaths = wonderchatScript?.getAttribute("data-ignore-paths");

let widgetSize = wonderchatScript?.getAttribute("data-widget-size");
let widgetButtonSize = wonderchatScript?.getAttribute(
    "data-widget-button-size"
);

const VALID_WIDGET_SIZES = {
    normal: {
        height: "680px",
        width: "384px",
    },
    large: {
        height: "800px",
        width: "422px",
    },
};

if (!VALID_WIDGET_SIZES[widgetSize]) {
    widgetSize = "normal";
}

const iframe = document.createElement("iframe");

function getIframeUrl(chatbotId) {
    let iframeUrl = `${window.location.protocol === "https:" ? "https" : "http"
        }://${removeHttp(wonderchatAddress)}/widget/${chatbotId}`;
    const urlObj = new URL(iframeUrl);
    const wonderchatParams = new URLSearchParams();

    if (dataGreeting) {
        wonderchatParams.append("greeting", dataGreeting);
    } else if (greeting) {
        wonderchatParams.append("greeting", greeting);
    }

    if (widgetButtonSize) {
        wonderchatParams.append("widgetButtonSize", widgetButtonSize);
    }

    urlObj.search = wonderchatParams.toString();

    iframeUrl = urlObj.toString();
    return iframeUrl;
}

function changeWonderchatChatbotId(chatbotId) {
    wonderchatId = chatbotId;
    const iframe = document.getElementById("wonderchat");
    const iframeUrl = getIframeUrl(chatbotId);
    iframe.setAttribute("src", iframeUrl);
}

let iframeUrl = getIframeUrl(wonderchatId);

iframe.setAttribute("src", iframeUrl);

iframe.setAttribute("allow", "fullscreen");
iframe.setAttribute("frameborder", "0");
iframe.setAttribute("scrolling", "no");
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.background = "transparent";
iframe.style["min-height"] = "auto";
iframe.id = "wonderchat";

function shouldAppendIframe() {
    if (!dataIgnorePaths) {
        if (!document.getElementById("wonderchat")) {
            wonderchatWrapper.style.zIndex = "9249299";
            wonderchatWrapper?.appendChild(iframe);
        }
    } else {
        const paths = dataIgnorePaths.split(",");
        for (let path of paths) {
            if (path.endsWith("*")) {
                const trimmedPath = path.slice(0, path.length - 2);
                const href = window.location.href;
                if (href.startsWith(trimmedPath)) {
                    const iframeToRemove = document.getElementById("wonderchat");
                    if (iframeToRemove) {
                        iframeToRemove.parentNode.removeChild(iframeToRemove);
                        wonderchatWrapper.style.zIndex = "-9249299";
                    }
                    return;
                }
            } else {
                if (path.endsWith("/")) {
                    path = path.slice(0, path.length - 1);
                }
                let url = window.location.href;
                if (url.endsWith("/")) {
                    url = url.slice(0, path.length - 1);
                }
                if (path === url) {
                    const iframeToRemove = document.getElementById("wonderchat");
                    if (iframeToRemove) {
                        iframeToRemove.parentNode.removeChild(iframeToRemove);
                        wonderchatWrapper.style.zIndex = "-9249299";
                    }
                    return;
                }
            }
        }
        if (!document.getElementById("wonderchat")) {
            wonderchatWrapper?.appendChild(iframe);
            wonderchatWrapper.style.zIndex = "9249299";
        }
    }
}

shouldAppendIframe();

let oldHref = document.location.href;

if (dataIgnorePaths) {
    window.onload = function () {
        const bodyList = document.querySelector("body");

        const observer = new MutationObserver(function (mutations) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                shouldAppendIframe();
                /* Changed ! your code here */
            }
        });

        const config = {
            childList: true,
            subtree: true,
        };

        observer.observe(bodyList, config);
    };
}

function waitForElm(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

waitForElm("#wonderchat").then((elm) => {
    var iframe = document.getElementById("wonderchat");

    window.addEventListener(
        "message",
        function (e) {
            if (!e.origin.match(wonderchatAddress)) {
                return;
            }
            let type;
            let payload;

            try {
                const parsed = JSON.parse(e.data);
                type = parsed.type;
                payload = parsed.payload;
            } catch (err) {
                return;
            }

            switch (type) {
                case "changeWrapperMargin": {
                    if (offsetBottom) {
                        wonderchatWrapper.style.marginBottom = offsetBottom;
                    }
                    if (offsetRight) {
                        wonderchatWrapper.style.marginRight = offsetRight;
                    }
                    break;
                }
                case "showChat": {
                    if (payload.isOpen === true) {
                        /* Non mobile, normal widget */
                        if (window.matchMedia("(min-width: 800px)").matches) {
                            iframe.parentNode.style.height = `min(100%, ${VALID_WIDGET_SIZES[widgetSize].height})`;
                            iframe.parentNode.style.width = `min(100%, ${VALID_WIDGET_SIZES[widgetSize].width})`;
                            document.body.style.overflow = oldOverflow;
                        } else {
                            /* Mobile, full screen widget */
                            iframe.parentNode.style.height = "100%";
                            iframe.parentNode.style.width = "100%";
                            document.body.style.setProperty(
                                "overflow",
                                "hidden",
                                "important"
                            );
                            if (offsetBottom) {
                                wonderchatWrapper.style.marginBottom = "0px";
                            }
                            if (offsetRight) {
                                wonderchatWrapper.style.marginRight = "0px";
                            }
                        }
                        widgetOpen = true;
                    } else {
                        iframe.parentNode.style.height =
                            widgetButtonSize === "large" ? "90px" : "80px";
                        iframe.parentNode.style.width =
                            widgetButtonSize === "large" ? "90px" : "80px";
                        document.body.style.overflow = oldOverflow;
                        widgetOpen = false;
                    }
                    break;
                }
                case "chatbotLoaded":
                    const chatHistory = JSON.parse(
                        localStorage.getItem(`chatHistory_${wonderchatId}`)
                            ? localStorage.getItem(`chatHistory_${wonderchatId}`)
                            : localStorage.getItem(`chatHistory`)
                                ? localStorage.getItem(`chatHistory`)
                                : "[]"
                    );
                    const chatlogId =
                        localStorage.getItem(`chatlogId_${wonderchatId}`) ??
                        localStorage.getItem(`chatlogId`) ??
                        null;
                    const userDetail = JSON.parse(
                        this.localStorage.getItem(`userDetail_${wonderchatId}`) ??
                        this.localStorage.getItem(`userDetail`) ??
                        "{}"
                    );
                    const userToken = localStorage.getItem(`${chatlogId}_token`) ?? null;

                    iframe.contentWindow.postMessage(
                        JSON.stringify({
                            type: "chatHistory",
                            payload: {
                                chatHistory,
                                chatlogId,
                                userDetail,
                                userToken,
                            },
                        }),
                        "*"
                    );
                    /* Only check once the chatbot has been loaded */
                    /* Only show greeting message if not shown before in this session, and if the widget is closed */
                    setTimeout(() => {
                        if (
                            !sessionStorage.getItem("shouldNotGreet") &&
                            !widgetOpen &&
                            payload.shouldSpontaneouslyGreet
                        ) {
                            iframe.contentWindow.postMessage(
                                JSON.stringify({ type: "showGreeting" }),
                                "*"
                            );
                            wonderchatWrapper.style.height = "185px";
                            wonderchatWrapper.style.width = "min(100%, 320px)";
                        }
                    }, 1000);
                    break;

                case "chatbotAcknowledged": {
                    sessionStorage.setItem("shouldNotGreet", "1");
                    break;
                }
                case "requestWidth": {
                    if (window.matchMedia("(min-width: 800px)").matches) {
                        iframe.contentWindow.postMessage(
                            JSON.stringify({ type: `popup` }),
                            "*"
                        );
                    } else {
                        iframe.contentWindow.postMessage(
                            JSON.stringify({ type: "fullscreen" }),
                            "*"
                        );
                    }
                    break;
                }
                case "chatHistory": {
                    const { chatHistory, chatlogId } = payload;
                    this.localStorage.setItem(
                        `chatHistory_${wonderchatId}`,
                        JSON.stringify(chatHistory)
                    );
                    if (chatlogId) {
                        this.localStorage.setItem(`chatlogId_${wonderchatId}`, chatlogId);
                    }
                    break;
                }

                case "clearChatHistory": {
                    const chatlogId = this.localStorage.getItem(
                        `chatlogId_${wonderchatId}`
                    );
                    this.localStorage.removeItem(`chatlogId`);
                    this.localStorage.removeItem(`chatHistory`);
                    this.localStorage.removeItem(`userDetail`);
                    this.localStorage.removeItem(`chatlogId_${wonderchatId}`);
                    this.localStorage.removeItem(`chatHistory_${wonderchatId}`);
                    this.localStorage.removeItem(`userDetail_${wonderchatId}`);
                    this.localStorage.removeItem(`${chatlogId}_token`);
                    break;
                }

                /* 
                  detail: 'EMAIL' | 'PHONE_NUMBER' | 'NAME'
                */

                case "userDetailCollected": {
                    const { detail } = payload;
                    const savedDetail =
                        this.localStorage.getItem(`userDetail_${wonderchatId}`) ??
                        this.localStorage.getItem(`userDetail`) ??
                        "{}";
                    try {
                        const parsed = JSON.parse(savedDetail);
                        const updatedDetail = { ...parsed, [detail]: true };
                        this.localStorage.setItem(
                            `userDetail_${wonderchatId}`,
                            JSON.stringify(updatedDetail)
                        );
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                }

                case "linkClick": {
                    const { href } = payload;
                    window.location.href = href;
                    break;
                }

                case "chatlogToken": {
                    const { chatlogId, userToken } = payload;
                    this.localStorage.setItem(`${chatlogId}_token`, userToken);
                }
            }
        },
        false
    );
});
