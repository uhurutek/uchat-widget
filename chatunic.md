```
var wn = window.navigator
console.log(wn);

const userAgent = navigator.userAgent;
console.log('User Agent:', userAgent);

// Timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log('Timezone:', userTimezone);

const uniqueID = Math.random().toString(36).substr(2, 9) + '_' + new Date().getTime();

// Local Storage
localStorage.setItem('uniqueIdentifier', uniqueID);
const storedValue = localStorage.getItem('uniqueIdentifier');
console.log('Stored Value:', storedValue);

// Session Storage
sessionStorage.setItem('sessionIdentifier', uniqueID);
const sessionValue = sessionStorage.getItem('sessionIdentifier');
console.log('Session Value:', sessionValue);

const country = (new Date()).toString().split('(')[1].split(" ")[0]
console.log('Country:', country);

// Set a cookie with an expiration date 1 year from now
function setCookie(cookieName, cookieValue, expirationDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Get the value of a cookie
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}
// Set a unique identifier cookie with a value (e.g., userID)
const userID = 'uniqueUserID123';
setCookie('userID', userID, 365); // Expires in 365 days

// Get the value of the 'userID' cookie
const storedUserID = getCookie('userID');
console.log('Stored UserID:', storedUserID);

//ip Address
const ipResponse = await fetch("https://checkip.amazonaws.com/");
const client_ip = await ipResponse.text();
```

```
<!DOCTYPE html>
<html>

<head>
    <title>Browser Fingerprint Example</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/2.1.0/fingerprint2.min.js"></script>
</head>

<body>
    <script>
        // Wait for the FingerprintJS library to load
        if (window.Fingerprint2) {
            // Create a FingerprintJS object
            const fpPromise = Fingerprint2.getPromise();

            // Get the fingerprint
            fpPromise
                .then(components => {
                    const values = components.map(component => component.value);

                    console.log(values);
                    const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
                    console.log('Browser Fingerprint:', fingerprint);
                })
                .catch(error => console.error('Fingerprint generation error:', error));
        } else {
            console.error('FingerprintJS library not loaded.');
        }
    </script>
</body>

</html>
```
