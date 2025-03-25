## User Sign-in
**Type**: Synchronous

**Reason**: Need to wait for sign-in request to be authenticated first through google, then user can access the platform.

## Podcast Stream Creation
**Type**: Synchronous

**Reason**: Need to wait for podcast to be set-up and link created before posting podcast into user's feed, user's being able to enter the podcast, or podcaster start streaming.


## Database Delete and Create Operations
**Type**: Synchronous

**Reason**: Wait until operations are confirmed to see changes. This also prevents creating/deleting more than once at the same time.

## Fetch Operations
**Type**: Asynchronous

**Reason**: No need to wait when fetching data from database or external APIs.

## Notifications
**Type**: Asynchronous

**Reason**: Notifications are randomly recieved. They are simply taken from message broker and displayed to user at any time. No need for user to **Wait** for them.

## Audio book / Podcast Streaming
**Type**: Asynchronous

**Reason**: Streaming in background while user browses the website. Audio is Outputted when recieved in buffer. 

## Audio book / Podcast Downloading
**Type**: Asynchronous

**Reason**: Downloading in background while user browses the website.