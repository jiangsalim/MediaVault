# MediaVault UX Improvements

## Overview

This document describes the UX investigation and improvement made to the MediaVault song page as part of the HERMAN evaluation task.

## Issue 1: Download Action Accessibility

### Investigation

I reviewed the video and download interaction on the song page.

The video player contains a YouTube action, which opens the corresponding YouTube video when selected. This behaviour is intentional and working as expected.

The song page also provides dedicated download actions for MP3 and video formats below the song information.

Since the existing YouTube action and download functionality are working as intended, no unnecessary functional change was made to this behaviour.

## Issue 2: Scrolling Experience

### Problem

On desktop screens, the video section remained sticky while the content below it was independently scrollable.

This caused the video and the rest of the song information to feel disconnected. While scrolling, the content could move underneath the video area, causing parts of the content to become hidden.

### Root Cause

The left content column used:

- `lg:max-h-screen`
- `lg:overflow-y-auto`

This created a separate scrolling container.

The video wrapper also used:

- `lg:sticky`
- `lg:top-16`

This caused the video to remain fixed while the surrounding content was being scrolled.

### Solution

The sticky positioning was removed from the video wrapper.

The viewport height restriction and independent vertical scrolling were also removed from the left content column.

The layout now allows the video and the content below it to remain in the normal document flow.

### Result

The song page now provides a more natural scrolling experience:

- The video scrolls together with the page content.
- The song information is no longer hidden behind the video.
- The separate scrolling behaviour of the left content area has been removed.
- The overall page feels more connected and consistent.

## What I Learned

This task helped me better understand how CSS positioning and overflow behaviour can affect the overall user experience.

In particular, I learned how Tailwind CSS utilities such as `sticky`, `max-h-screen`, and `overflow-y-auto` can combine to create independent scrolling and overlapping behaviour.

I also learned the importance of reproducing a UX issue locally before making changes, identifying the root cause, and verifying the result after implementation.



### Before

The video remained sticky while the content below moved underneath it.

### After

The video and page content now scroll naturally together.